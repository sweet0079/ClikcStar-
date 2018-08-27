/** 所有出生点控制 */
import * as lib from '../lib/lib'
import birthPointControl from './BirthPoint'
import ShapeManager from './ShapeManager'
import weaveControl from './weaveControl'
import UIControl from './UIControl'
import BossTimeInstance from './BossTimeInstance';
import { _kits } from '../../../libdts/kits';
import bossControl from './bossControl';

const {ccclass, property} = cc._decorator;

@ccclass
export default class BirthControl extends cc.Component {
    //----- 编辑器属性 -----//
    /** 套路多少秒来一波 */
    @property({tooltip:"套路多少秒来一波", type: cc.Integer}) WeaveComeTime: number = 20;
    /** 出生间隔数组 */
    @property({tooltip:"出生间隔数组", type: [cc.Float]}) BirthInterval: Array<number> = [];
    /** 出生个数数组 */
    @property({tooltip:"出生个数数组", type: [cc.Float]}) BirthNumber: Array<number> = [];
    /** 出生速度数组 */
    @property({tooltip:"出生速度数组", type: [cc.Float]}) BirthSpeed: Array<number> = [];
    /** 出生点数组 */
    @property([birthPointControl]) birthPoints: Array<birthPointControl> = [];
    //UI控制组件
    @property(UIControl) UIcon: UIControl = null;
    /** 特殊的预制体 */
    @property(cc.Prefab) bossprefeb: cc.Prefab = null;

    //----- 属性声明 -----//
    //已运行时间
    private time = 0;
    //间隔
    private interval = 0;
    //套路持续时间
    private weaveTime = 0;
    //套路已持续时间
    private weaveRunTime = 0;
    //套路是否开始标识符
    private bossFlag:boolean = false;
    //套路控制组件
    private _weaveControl:weaveControl = null;
    //特殊图形炸弹出现时间
    private _SpeB = 1000;
    //双倍炸弹概率
    private _SpeBDouPercent = 0;
    //特殊图形血包出现时间数组
    private _SpeHArr = [];
    //----- 生命周期 -----//
    // onLoad () {}

    start () {
        this.bossFlag = false;
        BossTimeInstance.getinstance().setisBossTime(false);
        ShapeManager.getinstance().clean();
        this._weaveControl = this.node.getComponent(weaveControl);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.ReStart,"reStart",this);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.OverGame,"gameover",this);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.Bomb,"bombCallBack",this);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.startClock,"startClock",this);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.Resurrection,"Resurrection",this);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.negitiveBomb,"CreatenegitiveBomb",this);
        if(cc.sys.localStorage.getItem('FirstPlay', 'undefined') == "true")
        {
            this.startClock();
        }
        else
        {
            cc.sys.localStorage.setItem('FirstPlay', 'true');
            this.NoviceGuidance();
        }
    }

    onDestroy(){
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.ReStart,"reStart",this);
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.OverGame,"gameover",this);
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.Bomb,"bombCallBack",this);
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.startClock,"startClock",this);
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.Resurrection,"Resurrection",this);
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.negitiveBomb,"CreatenegitiveBomb",this);
    }
    //----- 公有方法 -----//
    getbirthPoints(){
        return this.birthPoints;
    }
    getweaveRunTime(){
        return this.weaveRunTime;
    }
    setweaveRunTime(num){
        this.weaveRunTime = num;
    }
    setbossFlag(flag:boolean)
    {
        this.bossFlag = flag;
    }
    getbossFlag()
    {
        return this.bossFlag;
    }
    addtime(){
        this.time += 0.5;
    }
    getweaveTime(){
        return this.weaveTime;
    }
    setweaveTime(num){
        this.weaveTime = num;
    }
    //判断一个数字在数组中是否有重复，false指有重复
    checkRepeat(num:number,arr:Array<number>){
        for(let i = 0; i < arr.length; i++)
        {
            if(num == arr[i])
            {
                return false;
            }
            if(i == arr.length - 1)
            {
                return true;
            }
        }
    }
    // update (dt) {}
    //----- 事件回调 -----//
    private CreatenegitiveBomb(){
        this.schedule(()=>{
            for(let i = 0 ; i < 5 ; i++)
            {
                let temp = lib.RandomParameters.RandomParameters.getRandomInt(100);
                if(temp < this._SpeBDouPercent)
                {
                    let index = lib.RandomParameters.RandomParameters.getRandomInt(this.birthPoints.length);
                    let parameters = this.birthPoints[index].getRandomFlyParameters();
                    let Ctype:_kits.Characteristic.parameters = {
                        type: lib.defConfig.character.division,
                        divisionDistance: 0,
                    }
                    let Dparameters:_kits.Disspation.parameters = {
                        type: lib.defConfig.dissipate.none,
                    }
                    this.birthPoints[index].createSpecialShape(1,parameters,Dparameters,Ctype);
                }
                else
                {
                    this.birthPoints[lib.RandomParameters.RandomParameters.getRandomInt(this.birthPoints.length)].createSpecialShape(1);
                }
            }
        },1,2);
    }

    private Resurrection(){
        this.UIcon.initHP();
        this.schedule(this.clockFun,0.5);
        this.schedule(this.minHP,0.1);
    }
    private bombCallBack(){
        this.unschedule(this.clockFun);
        this._weaveControl.unscheduleAllCallbacks();
        this.scheduleOnce(()=>{
            this.UIcon.gameover(1);
        },1);
    }
    private gameover(){
        this.unschedule(this.clockFun);
        this.unschedule(this.minHP);
        this._weaveControl.unscheduleAllCallbacks();
        this.UIcon.gameover(0);
    }

    //重新开始游戏回调
    private reStart(){
        this.unschedule(this.clockFun);
        this.time = 0;
        this.interval = 0;
        this.bossFlag = false;
        this.weaveTime = 0;
        this.weaveRunTime = 0;
        BossTimeInstance.getinstance().setisBossTime(false);
        for(let i = 0; i < this.birthPoints.length; i++)
        {
            this.birthPoints[i].resetSpeed();
        }
        this.startClock();
    }
    
    private pause(){
        this.unschedule(this.clockFun);
        this._weaveControl.unscheduleAllCallbacks();
    }

    private continue(){
        this.schedule(this.clockFun,0.5);
    }
    //----- 私有方法 -----//
    //随着时间扣血
    private minHP(){
        if(this.time < 2 || BossTimeInstance.getinstance().getisBossTime())
        {
            return;
        }
        let temp = parseInt((this.time / 5).toString());
        if(temp >= lib.defConfig.HPdifficulty.length)
        {
            temp = lib.defConfig.HPdifficulty.length - 1;
        }
        this.UIcon.minHP(lib.defConfig.HPdifficulty[temp] / 10,false);
    }
    //创建boss
    private createBoss()
    {
        if(this.getweaveRunTime() == 0)
        {
            lib.msgEvent.getinstance().emit(lib.msgConfig.ShowWarn);
        }
        this.setweaveRunTime(this.getweaveRunTime() + 0.5);
        if(this.getweaveRunTime() == lib.defConfig.WarningTime)
        {
            this.UIcon.showHPBarLockAni();
            lib.msgEvent.getinstance().emit(lib.msgConfig.HideWarn);
            lib.msgEvent.getinstance().emit(lib.msgConfig.ShowClock,lib.defConfig.BossComingTime + lib.defConfig.BossLivingTime);
            let boss = cc.instantiate(this.bossprefeb);
            boss.getComponent(bossControl).setHP(lib.defConfig.bossdifficulty[lib.RandomParameters.RandomParameters.getRandomInt(lib.defConfig.bossdifficulty.length)]);
            boss.parent = this.birthPoints[0].shapeParNode;
            BossTimeInstance.getinstance().setisBossTime(true);
            this.scheduleOnce(()=>{
                this.bossFlag = false;
            },lib.defConfig.BossComingTime);
        }
    }

    //新手引导
    private NoviceGuidance(){
        // this._weaveControl.createNoviceGuidance();
        // this.UIcon.showNoviceGuidance();
        // this.scheduleOnce(()=>{
        //     ShapeManager.getinstance().pauseAllShape();
        //     this.UIcon.showNoviceGuidanceMask1();
        // },2);
        this.UIcon.clickHelp();
    }
    //根据时间增长，创建形状、提高难度
    private clockFun(){
        if(!this.bossFlag)
        {
            this.checkCreate();
            this.time += 0.5;
            this.interval += 0.5;
            // if(this.time % 1 == 0
            // && this.time >= 3)
            // {
            //     this.minTime();
            // }
            // console.log(this.time);
        }
        else
        {
            // this._weaveControl.Weave();
            this.createBoss();
        }
    }

    //开始计时
    private startClock(){
        this.schedule(this.clockFun,0.5);
        this.schedule(this.minHP,0.1);
    }

    private createSpeArr(){
        if(this.time > lib.defConfig.SpecialBirthTime[lib.defConfig.SpecialBirthTime.length - 1])
        {
            if(this.time % lib.defConfig.SpecialBirthinterval == 0)
            {
                this._SpeB = this.time + lib.RandomParameters.RandomParameters.getRandomInt(lib.defConfig.SpecialBirthinterval);
                this._SpeBDouPercent = 50;
                // console.log(this._SpeB);
            }
        }
        else
        {
            for(let i = 0; i < lib.defConfig.SpecialBirthTime.length - 1; i++)
            {
                if(this.time == lib.defConfig.SpecialBirthTime[i])
                {
                    this._SpeB = this.time + lib.RandomParameters.RandomParameters.getRandomInt(lib.defConfig.SpecialBirthTime[i + 1] - lib.defConfig.SpecialBirthTime[i]);
                    this._SpeBDouPercent = lib.defConfig.DoubleBomb[i];
                    // console.log(this._SpeB);
                }
            }
        }
        // if(this.time % 20 == 0)
        // {   
        //     this._SpeHArr = [];
        //     if(this.time > 80)
        //     {
        //         for(let i = 0; i < lib.defConfig.HealthNum[lib.defConfig.HealthNum.length - 1] ; i++)
        //         {
        //             this._SpeHArr.push(this.time + lib.RandomParameters.RandomParameters.getRandomInt(20));
        //         }
        //     }
        //     else
        //     {
        //         for(let i = 0; i < lib.defConfig.HealthNum[this.time / 20] ; i++)
        //         {
        //             this._SpeHArr.push(this.time + lib.RandomParameters.RandomParameters.getRandomInt(20));
        //         }
        //     }
        //     // console.log(this._SpeHArr);
        // }
    }

    //检验是否可以创建特殊形状
    private createSpeical(){
        this.createSpeArr();
        if(this.time == this._SpeB)
        {
            let temp = lib.RandomParameters.RandomParameters.getRandomInt(100);
            if(temp < this._SpeBDouPercent)
            {
                let index = lib.RandomParameters.RandomParameters.getRandomInt(this.birthPoints.length);
                let parameters = this.birthPoints[index].getRandomFlyParameters();
                let Ctype:_kits.Characteristic.parameters = {
                    type: lib.defConfig.character.division,
                    divisionDistance: 0,
                }
                let Dparameters:_kits.Disspation.parameters = {
                    type: lib.defConfig.dissipate.none,
                }
                this.birthPoints[index].createSpecialShape(1,parameters,Dparameters,Ctype);
            }
            else
            {
                this.birthPoints[lib.RandomParameters.RandomParameters.getRandomInt(this.birthPoints.length)].createSpecialShape(1);
            }
        }
        for(let i = 0; i < this._SpeHArr.length ; i++)
        {
            if(this.time == this._SpeHArr[i])
            {
                this.birthPoints[lib.RandomParameters.RandomParameters.getRandomInt(this.birthPoints.length)].createSpecialShape(0);
            }
        }
    }

    //检验是否可以创建形状
    private checkCreate(){
        this.createSpeical();
        let SerialNumber:number = parseInt((this.time / 10).toString());
        // console.log("this.time = " + this.time);
        // console.log("this.interval = " + this.interval);
        // console.log("SerialNumber = " + SerialNumber);
        //判断套路是否结束
        if(this.time != 0 && this.time % this.WeaveComeTime == 0)
        {
            this.bossFlag = true;
            this.weaveTime = 0;
            this.weaveRunTime = 0;
        }
        //判断当前难度
        if(SerialNumber >= this.BirthInterval.length
        || SerialNumber >= this.BirthNumber.length)
        {
            SerialNumber = this.BirthNumber.length - 1;
        }
        //判断是否该出形状
        if(this.interval >= this.BirthInterval[SerialNumber])
        {
            this.interval = 0;
            for(let i = 0; i < this.birthPoints.length; i++)
            {
                this.birthPoints[i].setSpeed(this.BirthSpeed[SerialNumber]);
            }
            this.BirthPointsCreate(this.BirthNumber[SerialNumber]);
        }
    }

    //num表示几个出生点生成形状
    private BirthPointsCreate(num:number){
        let birtharr = this.randomArray(num);
        for(let i = 0; i < birtharr.length; i++)
        {
            if(ShapeManager.getinstance().getNum() >= 10)
            {
                return;
            }
            this.birthPoints[birtharr[i]].createRandomShape();
        }
    }

    //生成一个num位的，各不相同的随机数组
    private randomArray(num,len = this.birthPoints.length){
        let tempArr = [];
        for(let i = 0; i < num; i++)
        {
            let temp = parseInt((cc.random0To1() * len).toString());
            if(tempArr.length == 0)
            {
                tempArr.push(temp);
            }
            else
            {
                while(!this.checkRepeat(temp,tempArr))
                {
                    temp = parseInt((cc.random0To1() * len).toString());
                }
                tempArr.push(temp);
            }
        }
        //console.log(tempArr);
        return tempArr;
    }

    private minTime(){
        this.UIcon.minTIME();
    }
}
