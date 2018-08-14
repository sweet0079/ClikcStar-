/** 套路控制 */
const {ccclass, property} = cc._decorator;

import * as lib from '../lib/lib'
import birthControl from './BirthControl'
import shapeControl from './ShapeControl'
import { _kits } from '../../../libdts/kits';
import ShapeManager from './ShapeManager';

@ccclass
export default class weaveControl extends cc.Component {
    //----- 编辑器属性 -----//
    /** 形状的预制体 */
    @property(cc.Prefab) blinkShapePre: cc.Prefab = null;
    @property(cc.Prefab) blinkSpeShapePre: cc.Prefab = null;
    /** 闪烁X轴数组 */
    @property({tooltip:"闪烁X轴数组", type: [cc.Integer]}) BlinkXArr: Array<number> = [];
    /** 闪烁Y轴数组 */
    @property({tooltip:"闪烁Y轴数组", type: [cc.Integer]}) BlinkYArr: Array<number> = [];
    //----- 属性声明 -----//
    //出生点总控制组件
    private _birthControl:birthControl = null;
    //套路类型
    private _weavetype: number = 0;
    //套路细节类型
    private _tempNum: number = 0;
    //----- 生命周期 -----//
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._birthControl = this.node.getComponent(birthControl);
    }

    start () {
    }

    // update (dt) {} 
    //----- 公有方法 -----//
    //创建新手引导的形状
    createNoviceGuidance(){
        //获取随机参数数值
        let dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
        dpare.type = lib.defConfig.dissipate.none;
        let cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
        cpare.type = lib.defConfig.character.none;
        let spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
        let fpare1 = this._birthControl.birthPoints[18].getRandomFlyParameters();
        fpare1.Speed = 200;
        fpare1.Angle = 0;
        this._birthControl.birthPoints[18].createAppointShape(fpare1,dpare,cpare,spare);
        this._birthControl.birthPoints[16].createSpecialShape(1,fpare1,dpare,cpare);
    }
    //创建闪烁的特殊形状
    createBlinkSpecial(num){
        let i = lib.RandomParameters.RandomParameters.getRandomInt(this.BlinkXArr.length);
        let j = lib.RandomParameters.RandomParameters.getRandomInt(this.BlinkYArr.length);
        let spare:_kits.ShapeControl.parameters = {
            type: num,
            color: 0,
        }
        let shape = cc.instantiate(this.blinkSpeShapePre);
        shape.setPosition(this.BlinkXArr[i],this.BlinkYArr[j]);
        shape.getComponent(shapeControl).setShape(spare.type);
        shape.parent = this._birthControl.birthPoints[0].getShapeParentNode();
    }
    //套路开始主方法
    // Weave(){
    //     let weavetype = parseInt((cc.random0To1() * (lib.defConfig.Tricks.length)).toString());
    //     let tempNum = lib.RandomParameters.RandomParameters.getRandomInt(lib.defConfig.BlinkArr.length);
    //     if(this._birthControl.getweaveRunTime() == 0)
    //     {
    //         this._weavetype = weavetype;
    //         this._tempNum = tempNum;
    //         lib.msgEvent.getinstance().emit(lib.msgConfig.ShowWarn,this.getComingShapeNum(this._weavetype,this._tempNum));
    //     }
    //     this._birthControl.setweaveRunTime(this._birthControl.getweaveRunTime() + 0.5);
    //     if(this._birthControl.getweaveRunTime() == lib.defConfig.WarningTime)
    //     {
    //         lib.msgEvent.getinstance().emit(lib.msgConfig.HideWarn);
    //         this.CreateWeave(this._weavetype);
    //         // // let startPoint = parseInt((cc.random0To1() * (this._birthControl.birthPoints.length)).toString());
    //         // this.ladder();
    //     }
    //     if(this._birthControl.getweaveRunTime() == lib.defConfig.WarningTime + this._birthControl.getweaveTime())
    //     {
    //         this._birthControl.setweaveFlag(false);
    //         this._birthControl.addtime();
    //     }
    // }
    //----- 私有方法 -----//
    private CreateWeave(type:number){
        switch(type)
        {
            case lib.defConfig.Tricks.volley:
                this.volley();
                break
            case lib.defConfig.Tricks.order:
                let startPoint = parseInt((cc.random0To1() * (this._birthControl.birthPoints.length)).toString());
                this.order(startPoint);
                break;
            case lib.defConfig.Tricks.union:
                this.union();
                break;
            case lib.defConfig.Tricks.symmetry:
                this.symmetry();
                break;
            case lib.defConfig.Tricks.Waterfall15:
                this.Waterfall15();
                break;
            case lib.defConfig.Tricks.Waterfall25:
                this.Waterfall25();
                break;
            case lib.defConfig.Tricks.focus:
                this.focus();
                break;
            case lib.defConfig.Tricks.focusDiv:
                this.focusDiv();
                break;
            case lib.defConfig.Tricks.across:
                this.across();
                break;
            case lib.defConfig.Tricks.blink:
                this.blink(this._tempNum);
                break;
            case lib.defConfig.Tricks.transform:
                this.transform();
                break;
            case lib.defConfig.Tricks.AbsoluteReb:
                this.AbsoluteReb();
                break;
            case lib.defConfig.Tricks.ladder:
                this.ladder();
                break;
            case lib.defConfig.Tricks.overlapping:
                this.overlapping();
                break;
            case lib.defConfig.Tricks.Stype:
                this.Stype();
                break;
            case lib.defConfig.Tricks.Fantastic4:
                this.Fantastic4();
                break;
        default:
                break;
        }
    }
    //Fantastic4主方法
    private Fantastic4(){
        //根据套路持续时间设置
        this._birthControl.setweaveTime(13 + lib.defConfig.WeaveEndTime);
        //获取随机bool值
        let fpareFlag: boolean = true;//是否固定相同的飞行轨迹
        let dpareFlag: boolean = true;//是否固定相同的消散
        let cpareFlag: boolean = true;//是否固定相同的特性
        let spareFlag: boolean = true;//是否固定相同的形状
        //获取随机参数数值
        let dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
        dpare.type = lib.defConfig.dissipate.none;
        let cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
        cpare.type = lib.defConfig.character.none;
        let spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
        let speed = this._birthControl.birthPoints[1].getRandomFlyParameters().Speed;
        let fpare = this._birthControl.birthPoints[1].getRandomFlyParameters();
        fpare.Angle = 0;
        fpare.Speed = speed * 1.2;
        
        let leftPointArr = [];
        let rightPointArr = [];
        let TopPointArr = [];
        let BottomPointArr = [];
        for(let i = 0 ; i < this._birthControl.birthPoints.length; i++)
        {
            if(this._birthControl.birthPoints[i].birthpos == lib.defConfig.birthpoint.left)
            {
                leftPointArr.push(i);
            }
            else if(this._birthControl.birthPoints[i].birthpos == lib.defConfig.birthpoint.right)
            {
                rightPointArr.push(i);
            }
            else if(this._birthControl.birthPoints[i].birthpos == lib.defConfig.birthpoint.top)
            {
                TopPointArr.push(i);
            }
            else if(this._birthControl.birthPoints[i].birthpos == lib.defConfig.birthpoint.bottom)
            {
                BottomPointArr.push(i);
            }
        }

        //左边出
        for(let j = 0 ; j < 2; j++)
        {
            this.scheduleOnce(()=>{
                this._birthControl.birthPoints[leftPointArr[1]].createAppointShape(fpare,dpare,cpare,spare);
                this._birthControl.birthPoints[leftPointArr[3]].createAppointShape(fpare,dpare,cpare,spare);
            },j * 1.3);
        }
        this.scheduleOnce(()=>{
            this._birthControl.birthPoints[leftPointArr[2]].createAppointShape(fpare,dpare,cpare,spare);
        },0.65);

        //上边出
        this.scheduleOnce(()=>{
            for(let j = 0 ; j < 2; j++)
            {
                this.scheduleOnce(()=>{
                    this._birthControl.birthPoints[TopPointArr[1]].createAppointShape(fpare,dpare,cpare,spare);
                    this._birthControl.birthPoints[TopPointArr[1]].createAppointShape(fpare,dpare,cpare,spare);
                },j * 1.3);
            }
            this.scheduleOnce(()=>{
                this._birthControl.birthPoints[TopPointArr[0]].createAppointShape(fpare,dpare,cpare,spare);
                this._birthControl.birthPoints[TopPointArr[1]].createAppointShape(fpare,dpare,cpare,spare);
                this._birthControl.birthPoints[TopPointArr[2]].createAppointShape(fpare,dpare,cpare,spare);
            },0.65);
        },4);

        //右边出
        this.scheduleOnce(()=>{
            for(let j = 0 ; j < 2; j++)
            {
                this.scheduleOnce(()=>{
                    this._birthControl.birthPoints[rightPointArr[1]].createAppointShape(fpare,dpare,cpare,spare);
                    this._birthControl.birthPoints[rightPointArr[2]].createAppointShape(fpare,dpare,cpare,spare);
                    this._birthControl.birthPoints[rightPointArr[3]].createAppointShape(fpare,dpare,cpare,spare);
                },j * 1.3);
            }
            this.scheduleOnce(()=>{
                this._birthControl.birthPoints[rightPointArr[1]].createAppointShape(fpare,dpare,cpare,spare);
                this._birthControl.birthPoints[rightPointArr[3]].createAppointShape(fpare,dpare,cpare,spare);
            },0.65);
        },8);

        //下边出
        this.scheduleOnce(()=>{
            for(let j = 0 ; j < 3; j++)
            {
                this.scheduleOnce(()=>{
                    this._birthControl.birthPoints[BottomPointArr[0]].createAppointShape(fpare,dpare,cpare,spare);
                    this._birthControl.birthPoints[BottomPointArr[1]].createAppointShape(fpare,dpare,cpare,spare);
                    this._birthControl.birthPoints[BottomPointArr[2]].createAppointShape(fpare,dpare,cpare,spare);
                },j * 0.75);
            }
        },12);

    }
    //S型主方法
    private Stype(){
        let istop = lib.RandomParameters.RandomParameters.getRandomBool();
        //根据套路持续时间设置
        this._birthControl.setweaveTime(6 + lib.defConfig.WeaveEndTime);

        //获取随机bool值
        let fpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的飞行轨迹
        let dpareFlag: boolean = true;//是否固定相同的消散
        let cpareFlag: boolean = true;//是否固定相同的特性
        let spareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的形状
        let speed = this._birthControl.birthPoints[1].getRandomFlyParameters().Speed;
        
        //获取随机参数数值
        let dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
        let cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
        let spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();

        for(let i = 0 ; i < 18; i++)
        {
            let index = 0;
            let temp = i % 6;
            if(temp == 0 || temp == 1 || temp == 2)
            {
                if(istop)
                {
                    index = temp + 1; 
                }
                else
                {
                    index = temp + 11; 
                }
            }
            else if(temp == 3)
            {
                if(istop)
                {
                    index = 3;
                }
                else
                {
                    index = 13;
                }
            }
            else if(temp == 4)
            {
                if(istop)
                {
                    index = 2;
                }
                else
                {
                    index = 12;
                }
            }
            else if(temp == 5)
            {
                if(istop)
                {
                    index = 1;
                }
                else
                {
                    index = 11;
                }
            }
            this.scheduleOnce(()=>{
                let fpare = this._birthControl.birthPoints[index].getRandomFlyParameters();
                fpare.Angle = 0;
                fpare.Speed = speed;
                if(!dpareFlag)
                {
                    dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
                }
                if(!cpareFlag)
                {
                    cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
                }
                if(!spareFlag)
                {
                    spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
                }
                this._birthControl.birthPoints[index].createAppointShape(fpare,dpare,cpare,spare);
            },i * 0.5);
        }
    }
    //错位主方法
    private overlapping(){

        let temp = lib.RandomParameters.RandomParameters.getRandomInt(2);
        //根据套路持续时间设置
        this._birthControl.setweaveTime(4 + lib.defConfig.WeaveEndTime);

        //获取随机bool值
        let fpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的飞行轨迹
        let dpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的消散
        let cpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的特性
        let spareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的形状
        
        //获取随机参数数值
        let dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
        dpare.type = lib.defConfig.dissipate.rebound;
        let cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
        let spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();

        for(let i = 0 ; i < 3; i++)
        {
            this.scheduleOnce(()=>{
                for(let i = 0; i < this._birthControl.birthPoints.length; i++)
                {
                    if(this._birthControl.birthPoints[i].birthpos == lib.defConfig.birthpoint.left)
                    {
                        if(temp)
                        { 
                            if(i % 2 == 1)
                            {
                                continue;
                            }
                        }
                        else
                        {
                            if(i % 2 == 0)
                            {
                                continue;
                            }
                        }
                        let fpare = this._birthControl.birthPoints[i].getRandomFlyParameters();
                        // if(fpareFlag)
                        // {
                        fpare.Speed = 445;
                        // }
                        fpare.Angle = 0;
                        this._birthControl.birthPoints[i].createAppointShape(fpare,dpare,cpare,spare);
                    }
                    else if(this._birthControl.birthPoints[i].birthpos == lib.defConfig.birthpoint.right)
                    {
                        if(temp)
                        { 
                            if(i % 2 == 0)
                            {
                                continue;
                            }
                        }
                        else
                        {
                            if(i % 2 == 1)
                            {
                                continue;
                            }
                        }
                        let fpare = this._birthControl.birthPoints[i].getRandomFlyParameters();
                        // if(fpareFlag)
                        // {
                        fpare.Speed = 445;
                        // }
                        fpare.Angle = 0;
                        this._birthControl.birthPoints[i].createAppointShape(fpare,dpare,cpare,spare);
                    }
                }
            },i * 2);
        }
    }
    //阶梯主方法
    private ladder(){
        let temp = lib.RandomParameters.RandomParameters.getRandomInt(2);

        //根据套路持续时间设置
        this._birthControl.setweaveTime(4 + lib.defConfig.WeaveEndTime);

        //获取随机bool值
        let fpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的飞行轨迹
        let dpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的消散
        let cpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的特性
        let spareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的形状
        
        //获取随机参数数值
        let dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
        dpare.type = lib.defConfig.dissipate.rebound;
        let cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
        let spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();

        for(let i = 0 ; i < 10; i++)
        {
            this.scheduleOnce(()=>{
                if(temp == 0)
                {
                    let spare1 = spare;
                    if(!spareFlag)
                    {
                        spare1 = lib.RandomParameters.RandomParameters.getRandomShaParameters();
                    }
                    let fpare1 = this._birthControl.birthPoints[0].getRandomFlyParameters();
                    fpare1.Angle = this._birthControl.birthPoints[0].getAngleToPoint(lib.defConfig.DesignPlayWidth / 2,600);
                    this._birthControl.birthPoints[0].createAppointShape(fpare1,dpare,cpare,spare1);
                    let spare3 = spare;
                    if(!spareFlag)
                    {
                        spare3 = lib.RandomParameters.RandomParameters.getRandomShaParameters();
                    }
                    let fpare3 = this._birthControl.birthPoints[14].getRandomFlyParameters();
                    fpare3.Angle = this._birthControl.birthPoints[14].getAngleToPoint(lib.defConfig.DesignPlayWidth / 2,-600);
                    this._birthControl.birthPoints[14].createAppointShape(fpare3,dpare,cpare,spare3);
                }
                else if(temp == 1)
                {
                    let spare2 = spare;
                    if(!spareFlag)
                    {
                        spare2 = lib.RandomParameters.RandomParameters.getRandomShaParameters();
                    }
                    let fpare2 = this._birthControl.birthPoints[4].getRandomFlyParameters();
                    fpare2.Angle = this._birthControl.birthPoints[4].getAngleToPoint(-lib.defConfig.DesignPlayWidth / 2,600);
                    this._birthControl.birthPoints[4].createAppointShape(fpare2,dpare,cpare,spare2); 
                    let spare4 = spare;
                    if(!spareFlag)
                    {
                        spare4 = lib.RandomParameters.RandomParameters.getRandomShaParameters();
                    }
                    let fpare4 = this._birthControl.birthPoints[10].getRandomFlyParameters();
                    fpare4.Angle = this._birthControl.birthPoints[10].getAngleToPoint(-lib.defConfig.DesignPlayWidth / 2,-600);
                    this._birthControl.birthPoints[10].createAppointShape(fpare4,dpare,cpare,spare4);
                }
            },i * 0.5);
        }

    }

    //绝对反弹主方法
    private AbsoluteReb(){
        //根据套路持续时间设置
        this._birthControl.setweaveTime(3 + lib.defConfig.WeaveEndTime);

        //获取随机bool值
        let fpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的飞行轨迹
        let dpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的消散
        let cpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的特性
        let spareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的形状
        
        //获取随机参数数值
        let dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
        dpare.type = lib.defConfig.dissipate.rebound;
        let cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
        let spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();

        for(let i = 0 ; i < 5; i++)
        {
            this.scheduleOnce(()=>{
                let spare1 = spare;
                if(!spareFlag)
                {
                    spare1 = lib.RandomParameters.RandomParameters.getRandomShaParameters();
                }
                let fpare1 = this._birthControl.birthPoints[2].getRandomFlyParameters();
                fpare1.Angle = this._birthControl.birthPoints[2].getAngleToPoint(lib.defConfig.DesignPlayWidth / 2 ,0);
                this._birthControl.birthPoints[2].createAppointShape(fpare1,dpare,cpare,spare1);
                
                let spare2 = spare;
                if(!spareFlag)
                {
                    spare2 = lib.RandomParameters.RandomParameters.getRandomShaParameters();
                }
                let fpare2 = this._birthControl.birthPoints[7].getRandomFlyParameters();
                fpare2.Angle = this._birthControl.birthPoints[7].getAngleToPoint(0,-lib.defConfig.DesignPlayHeight / 2);
                this._birthControl.birthPoints[7].createAppointShape(fpare2,dpare,cpare,spare2);

                let spare3 = spare;
                if(!spareFlag)
                {
                    spare3 = lib.RandomParameters.RandomParameters.getRandomShaParameters();
                }
                let fpare3 = this._birthControl.birthPoints[12].getRandomFlyParameters();
                fpare3.Angle = this._birthControl.birthPoints[12].getAngleToPoint(-lib.defConfig.DesignPlayWidth / 2,0);
                this._birthControl.birthPoints[12].createAppointShape(fpare3,dpare,cpare,spare3);

                let spare4 = spare;
                if(!spareFlag)
                {
                    spare4 = lib.RandomParameters.RandomParameters.getRandomShaParameters();
                }
                let fpare4 = this._birthControl.birthPoints[17].getRandomFlyParameters();
                fpare4.Angle = this._birthControl.birthPoints[17].getAngleToPoint(0,lib.defConfig.DesignPlayHeight / 2);
                this._birthControl.birthPoints[17].createAppointShape(fpare4,dpare,cpare,spare4);
            },i * 0.5);
        }
    }

    //传送主方法
    private transform(){
        //随机是上下还是左右出
        let temp = lib.RandomParameters.RandomParameters.getRandomInt(2);
        let pointArr = [];
        if(temp == 0)
        {
            pointArr = [1,2,3];
        }
        else
        {
            pointArr = [5,7,9];
        }
        //根据套路持续时间设置
        this._birthControl.setweaveTime(3 + lib.defConfig.WeaveEndTime);

        //获取随机bool值
        let fpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的飞行轨迹
        let dpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的消散
        let cpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的特性
        let spareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的形状
        
        //获取随机参数数值
        let fpare = this._birthControl.birthPoints[pointArr[0]].getRandomFlyParameters();
        let sfpare = fpare;
        let dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
        let cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
        let spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
        dpare.type = lib.defConfig.dissipate.integration;
        for(let i = 0 ; i < 3; i++)
        {
            this.scheduleOnce(()=>{
                for(let j = 0 ; j < pointArr.length; j++)
                {
                    let angle = fpare.Angle;
                    this._birthControl.birthPoints[pointArr[j]].createAppointShape(fpare,dpare,cpare,spare);
                    this._birthControl.birthPoints[lib.RandomParameters.RandomParameters.getSymmetricPoint(pointArr[j])].createAppointShape(sfpare,dpare,cpare,spare);
                }
            },i);
        }
    }

    //闪烁主方法
    private blink(tempNum:number){
        let arr = [];
        //根据套路持续时间设置
        this._birthControl.setweaveTime(3 + lib.defConfig.WeaveEndTime);

        //获取随机bool值
        let fpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的飞行轨迹
        let dpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的消散
        let cpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的特性
        let spareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的形状
        let spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
        switch(tempNum)
        {
            case 0: 
                arr = lib.defConfig.BlinkArr.all;
                break;
            case 1: 
                arr = lib.defConfig.BlinkArr.WenZiS;
                spareFlag = true;
                break;
            case 2: 
                arr = lib.defConfig.BlinkArr.WenZiT;
                spareFlag = true;
                break;
            case 3: 
                arr = lib.defConfig.BlinkArr.WenZiA;
                spareFlag = true;
                break;
            case 4: 
                arr = lib.defConfig.BlinkArr.WenZiR;
                spareFlag = true;
                break;
            default:
                arr = lib.defConfig.BlinkArr.all;
                break;
        }

        for(let j = 0; j < this.BlinkYArr.length; j++)
        {
            if(!spareFlag)
            {
                spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
            }
            for(let i = 0; i < this.BlinkXArr.length; i++)
            {
                if(!arr[j][i])
                {
                    continue;
                }
                let shape = cc.instantiate(this.blinkShapePre);
                shape.setPosition(this.BlinkXArr[i],this.BlinkYArr[j]);
                shape.getComponent(shapeControl).setShape(spare.type);
                shape.parent = this._birthControl.birthPoints[0].getShapeParentNode();
                ShapeManager.getinstance().addShape(shape);
            }
        }
    }

    //交叉主方法
    private across(){
        //根据套路持续时间设置
        this._birthControl.setweaveTime(1 + lib.defConfig.WeaveEndTime);

        //获取随机bool值
        let fpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的飞行轨迹
        let dpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的消散
        let cpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的特性
        let spareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的形状
        //获取随机参数数值
        let speed = this._birthControl.birthPoints[1].getRandomFlyParameters().Speed;
        let dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
        let cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
        let spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
        //所有角落同时生成形状
        for(let i = 0; i < this._birthControl.birthPoints.length; i++)
        {
            if(this._birthControl.birthPoints[i].birthpos != lib.defConfig.birthpoint.leftbottom 
            && this._birthControl.birthPoints[i].birthpos != lib.defConfig.birthpoint.lefttop
            && this._birthControl.birthPoints[i].birthpos != lib.defConfig.birthpoint.rightbottom
            && this._birthControl.birthPoints[i].birthpos != lib.defConfig.birthpoint.righttop)
            {
                continue;
            }
            let fpare = this._birthControl.birthPoints[i].getRandomFlyParameters();
            // if(fpareFlag)
            // {
            fpare.Speed = speed;
            // }
            fpare.Angle = this._birthControl.birthPoints[i].getAngleToPoint(0,0);
            if(!dpareFlag)
            {
                dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
            }
            if(!cpareFlag)
            {
                cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
            }
            if(!spareFlag)
            {
                spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
            }
            let index = i;
            for(let j = 0; j < 5; j++)
            {
                this.scheduleOnce(()=>{
                    cpare.divisionDistance =  this._birthControl.birthPoints[index].getDisToPoint(0,0);
                    this._birthControl.birthPoints[index].createAppointShape(fpare,dpare,cpare,spare);
                },j * 0.5);
            }
        }

    }

    //集中分裂主方法
    private focusDiv(){
        let temp = lib.RandomParameters.RandomParameters.getRandomInt(2);
        //根据套路持续时间设置
        this._birthControl.setweaveTime(4 + lib.defConfig.WeaveEndTime);

        //获取随机bool值
        let fpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的飞行轨迹
        let dpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的消散
        let cpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的特性
        let spareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的形状
        //获取随机参数数值
        let speed = this._birthControl.birthPoints[1].getRandomFlyParameters().Speed;
        let dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
        let cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
        cpare.type = lib.defConfig.character.division;
        let spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
        //所有点同时生成形状
        for(let i = 0; i < this._birthControl.birthPoints.length; i++)
        {
            if(i % 2 == temp)
            {
                continue;
            }
            let fpare = this._birthControl.birthPoints[i].getRandomFlyParameters();
            // if(fpareFlag)
            // {
                fpare.Speed = speed;
            // }
            fpare.Angle = this._birthControl.birthPoints[i].getAngleToPoint(0,0);
            // if(!dpareFlag)
            // {
            //     dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
            // }
            // if(!cpareFlag)
            // {
            //     cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
            // }
            // if(!spareFlag)
            // {
            //     spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
            // }
            let index = i;
            for(let j = 0; j < 3; j++)
            {
                this.scheduleOnce(()=>{
                    cpare.divisionDistance =  this._birthControl.birthPoints[index].getDisToPoint(0,0);
                    this._birthControl.birthPoints[index].createAppointShape(fpare,dpare,cpare,spare);
                },j * 0.5);
            }
        }
    }

    //集中主方法
    private focus()
    {
        let temp = lib.RandomParameters.RandomParameters.getRandomInt(2);
        //根据套路持续时间设置
        this._birthControl.setweaveTime(4 + lib.defConfig.WeaveEndTime);

        //获取随机bool值
        let fpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的飞行轨迹
        let dpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的消散
        let cpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的特性
        let spareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的形状
        //获取随机参数数值
        let speed = this._birthControl.birthPoints[1].getRandomFlyParameters().Speed;
        let dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
        let cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
        let spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
        //所有点同时生成形状
        for(let i = 0; i < this._birthControl.birthPoints.length; i++)
        {
            if(i % 2 == temp)
            {
                continue;
            }
            let fpare = this._birthControl.birthPoints[i].getRandomFlyParameters();
            // if(fpareFlag)
            // {
                fpare.Speed = speed;
            // }
            fpare.Angle = this._birthControl.birthPoints[i].getAngleToPoint(0,0);
            // if(!dpareFlag)
            // {
            //     dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
            // }
            // if(!cpareFlag)
            // {
            //     cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
            // }
            // if(!spareFlag)
            // {
            //     spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
            // }
            let index = i;
            for(let j = 0; j < 1; j++)
            {
                this.scheduleOnce(()=>{
                    this._birthControl.birthPoints[index].createAppointShape(fpare,dpare,cpare,spare);
                },j * 0.5);
            }
        }
    }

    //20个形状的飞瀑主方法
    private Waterfall25(){
        //根据套路持续时间设置
        this._birthControl.setweaveTime(3 + lib.defConfig.WeaveEndTime);

        //获取随机方向
        let dir = 0;
        let temp = parseInt((cc.random0To1() * 2).toString());
        switch(temp)
        {
            case 0:
                dir = lib.defConfig.birthpoint.left;
                break;
            case 1:
                dir = lib.defConfig.birthpoint.right;
                break;
            default:
                break;
        }

        //获取随机bool值
        let fpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的飞行轨迹
        let dpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的消散
        let cpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的特性
        let spareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的形状
        
        //获取随机参数数值
        let angle = 0;
        let speed = this._birthControl.birthPoints[1].getRandomFlyParameters().Speed;
        let dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
        let cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
        let spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
        //找到对应边生成形状
        for(let i = 0; i < this._birthControl.birthPoints.length; i++)
        {
            if(this._birthControl.birthPoints[i].birthpos == dir)
            {
                let fpare = this._birthControl.birthPoints[i].getRandomFlyParameters();
                fpare.Angle = angle;
                fpare.Speed = speed;
                let index = i;
                for(let j = 0; j < 5; j++)
                {
                    this.scheduleOnce(()=>{
                        this._birthControl.birthPoints[index].createAppointShape(fpare,dpare,cpare,spare);
                    },j * 0.5);
                }
            }
        }
    }

    //15个形状的飞瀑主方法
    private Waterfall15(){
        //根据套路持续时间设置
        this._birthControl.setweaveTime(3 + lib.defConfig.WeaveEndTime);

        //获取随机方向
        let dir = 0;
        let temp = parseInt((cc.random0To1() * 2).toString());
        switch(temp)
        {
            case 0:
                dir = lib.defConfig.birthpoint.bottom;
                break;
            case 1:
                dir = lib.defConfig.birthpoint.top;
                break;
            default:
                break;
        }

        //获取随机bool值
        let fpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的飞行轨迹
        let dpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的消散
        let cpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的特性
        let spareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的形状
        
        //获取随机参数数值
        let angle = 0;
        let speed = this._birthControl.birthPoints[1].getRandomFlyParameters().Speed;
        let dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
        let cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
        let spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
        //找到对应边生成形状
        for(let i = 0; i < this._birthControl.birthPoints.length; i++)
        {
            if(this._birthControl.birthPoints[i].birthpos == dir)
            {
                let fpare = this._birthControl.birthPoints[i].getRandomFlyParameters();
                fpare.Angle = angle;
                fpare.Speed = speed;
                let index = i;
                for(let j = 0; j < 5; j++)
                {
                    this.scheduleOnce(()=>{
                        this._birthControl.birthPoints[index].createAppointShape(fpare,dpare,cpare,spare);
                    },j * 0.5);
                }
            }
        }
    }

    //齐射主方法
    private volley(){
        //根据套路持续时间设置
        this._birthControl.setweaveTime(2 + lib.defConfig.WeaveEndTime);

        //获取随机bool值
        let fpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的飞行轨迹
        let dpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的消散
        let cpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的特性
        let spareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的形状
        //获取随机参数数值
        let speed = this._birthControl.birthPoints[1].getRandomFlyParameters().Speed;
        let dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
        let cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
        let spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
        //所有点同时生成形状
        for(let i = 0; i < this._birthControl.birthPoints.length; i++)
        {
            let fpare = this._birthControl.birthPoints[i].getRandomFlyParameters();
            // if(fpareFlag)
            // {
                fpare.Speed = speed;
            // }
            fpare.Angle = this._birthControl.birthPoints[i].getAngleToPoint(0,0);
            // if(!dpareFlag)
            // {
            //     dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
            // }
            // if(!cpareFlag)
            // {
            //     cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
            // }
            // if(!spareFlag)
            // {
            //     spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
            // }
            this._birthControl.birthPoints[i].createAppointShape(fpare,dpare,cpare,spare);
        }
    }

    //联合主方法
    private union(){
        //根据套路持续时间设置
        this._birthControl.setweaveTime(3 + lib.defConfig.WeaveEndTime);

        //获取随机bool值
        let fpareFlag: boolean = false;//是否固定相同的飞行轨迹
        let dpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的消散
        let cpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的特性
        let spareFlag: boolean = true;//是否固定相同的形状
        //获取随机参数数值
        let dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
        let cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
        let spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
        //所有点同时生成形状
        for(let i = 0; i < 3; i++)
        {
            let birNum = parseInt((cc.random0To1() * (this._birthControl.birthPoints.length)).toString());
            let angle = this._birthControl.birthPoints[birNum].getRandomFlyParameters().Angle;
            let speed = this._birthControl.birthPoints[birNum].getRandomFlyParameters().Speed;
            this.scheduleOnce(()=>{
                for(let i = 0; i < 5; i++)
                {
                    let fpare = this._birthControl.birthPoints[birNum].getRandomFlyParameters();
                    if(fpareFlag)
                    {
                        fpare.Angle = angle;
                        fpare.Speed = speed;
                    }
                    //fpare.Angle = this.birthPoints[birNum].getAngleToPoint(0,0);
                    if(!dpareFlag)
                    {
                        dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
                    }
                    if(!cpareFlag)
                    {
                        cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
                    }
                    if(!spareFlag)
                    {
                        spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
                    }
                    this._birthControl.birthPoints[birNum].createAppointShape(fpare,dpare,cpare,spare);
                }
            },i * 2);
        }
    }

    //有序主方法
    private order(startpoint:number){
        startpoint = startpoint % this._birthControl.birthPoints.length;
        //根据套路持续时间设置
        this._birthControl.setweaveTime(10 + lib.defConfig.WeaveEndTime);

        //获取随机bool值
        let fpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的飞行轨迹
        let dpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的消散
        let cpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的特性
        let spareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的形状
        //获取随机参数数值
        let speed = this._birthControl.birthPoints[1].getRandomFlyParameters().Speed;
        let dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
        let cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
        let spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
        //逐个点生成形状
        for(let i = 0; i < this._birthControl.birthPoints.length; i++)
        {
            this.scheduleOnce(()=>{
                let temp = i + startpoint;
                if(temp >= this._birthControl.birthPoints.length)
                {
                    temp -= this._birthControl.birthPoints.length;
                }
                let fpare = this._birthControl.birthPoints[temp].getRandomFlyParameters();
                // if(fpareFlag)
                // {
                    fpare.Speed = speed;
                // }
                fpare.Angle = this._birthControl.birthPoints[temp].getAngleToPoint(0,0);
                // if(!dpareFlag)
                // {
                //     dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
                // }
                // if(!cpareFlag)
                // {
                //     cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
                // }
                // if(!spareFlag)
                // {
                //     spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
                // }
                this._birthControl.birthPoints[temp].createAppointShape(fpare,dpare,cpare,spare);
            },i * 0.5);
        }
    }

    //对称套路主方法
    private symmetry(){
        //随机是上下还是左右出
        let temp = lib.RandomParameters.RandomParameters.getRandomInt(2);
        let pointArr = [];
        if(temp == 0)
        {
            pointArr = [1,2,3];
        }
        else
        {
            pointArr = [5,7,9];
        }
        //根据套路持续时间设置
        this._birthControl.setweaveTime(4 + lib.defConfig.WeaveEndTime);

        //获取随机bool值
        let fpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的飞行轨迹
        let dpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的消散
        let cpareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的特性
        let spareFlag: boolean = lib.RandomParameters.RandomParameters.getRandomBool();//是否固定相同的形状
        //获取随机参数数值
        let fpare = this._birthControl.birthPoints[pointArr[0]].getRandomFlyParameters();
        let sfpare = fpare;
        let dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
        let cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
        let spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
        //是否是异度角标识
        let reverse:boolean = lib.RandomParameters.RandomParameters.getRandomBool();
        for(let i = 0 ; i < 3; i++)
        {
            this.scheduleOnce(()=>{
                for(let j = 0 ; j < pointArr.length; j++)
                {
                    let angle = fpare.Angle;
                    this._birthControl.birthPoints[pointArr[j]].createAppointShape(fpare,dpare,cpare,spare);
                    //根据是否随机各项参数来判断是否需要重新赋值
                    // if(fpareFlag)
                    // {
                        // fpare.Speed = speed;
                    // }
                    // if(!dpareFlag)
                    // {
                    //     dpare = lib.RandomParameters.RandomParameters.getRandomDisParameters();
                    // }
                    // if(!cpareFlag)
                    // {
                    //     cpare = lib.RandomParameters.RandomParameters.getRandomChaParameters();
                    // }
                    // if(!spareFlag)
                    // {
                    //     spare = lib.RandomParameters.RandomParameters.getRandomShaParameters();
                    // }
                    // if(reverse)
                    // {
                    //     if(this._birthControl.birthPoints[lib.RandomParameters.RandomParameters.getSymmetricPoint(pointArr[j])].JudgeAngleLegality(-angle))
                    //     {
                    //         sfpare.Angle = -angle;
                    //     }
                    // }
                    this._birthControl.birthPoints[lib.RandomParameters.RandomParameters.getSymmetricPoint(pointArr[j])].createAppointShape(sfpare,dpare,cpare,spare);
                }
            },i);
        }
    }

    //返回每个套路的形状个数
    getComingShapeNum(num:number,tempNum:number)
    {
        let answer = 0;
        switch(num)
        {
            case lib.defConfig.Tricks.volley:
                answer = 20;
                break
            case lib.defConfig.Tricks.order:
                answer = 20;
                break;
            case lib.defConfig.Tricks.union:
                answer = 15;
                break;
            case lib.defConfig.Tricks.symmetry:
                answer = 18;
                break;
            case lib.defConfig.Tricks.Waterfall15:
                answer = 15;
                break;
            case lib.defConfig.Tricks.Waterfall25:
                answer = 25;
                break;
            case lib.defConfig.Tricks.focus:
                answer = 10;
                break;
            case lib.defConfig.Tricks.focusDiv:
                answer = 30;
                break;
            case lib.defConfig.Tricks.across:
                answer = 20;
                break;
            case lib.defConfig.Tricks.blink:
                switch(tempNum)
                {
                    case 0: 
                        answer = 15;
                        break;
                    case 1: 
                        answer = 9;
                        break;
                    case 2: 
                        answer = 7;
                        break;
                    case 3: 
                        answer = 9;
                        break;
                    case 4: 
                        answer = 12;
                        break;
                    default:
                        answer = 15;
                        break;
                }
                break;
            case lib.defConfig.Tricks.transform:
                answer = 18;
                break;
            case lib.defConfig.Tricks.AbsoluteReb:
                answer = 20;
                break;
            case lib.defConfig.Tricks.ladder:
                answer = 20;
                break;
            case lib.defConfig.Tricks.overlapping:
                answer = 15;
                break;
            case lib.defConfig.Tricks.Stype:
                answer = 18;
                break;
            case lib.defConfig.Tricks.Fantastic4:
                answer = 29;
                break;
            default:
                break;
        }  
        return answer; 
    }
}
