/** 挂在UI层，控制UI显示方面的脚本 */
import * as lib from '../lib/lib'
import ShapeManager from './ShapeManager'
import powerFullcontrol from './PowerFullCon'
import HPBarCon from "./HPBarControl"
import EffectCon from "./EffectControl"
import { _kits } from '../../../libdts/kits';

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIcontrol extends cc.Component {
    //----- 编辑器属性 -----//
    //分数的label组件
    @property(cc.Label) Socrelabel: cc.Label = null;
    //warning节点组件
    @property(cc.Node) warning: cc.Node = null;
    //血条组件
    @property(HPBarCon) HPBar: HPBarCon = null;
    // //能量条组件
    // @property(cc.ProgressBar) POWER: cc.ProgressBar = null;
    //gameover界面
    @property(cc.Node) OverLayer: cc.Node = null;
    //pause界面
    @property(cc.Node) PauseLayer: cc.Node = null;
    //Help界面
    @property(cc.Node) HelpLayer: cc.Node = null;
    // //能量条闪
    // @property(cc.Node) ShanLayer: cc.Node = null;
    //red界面
    // @property(cc.Node) RedLayer: cc.Node = null;
    //倒计时的label组件
    @property(cc.Label) Timelabel: cc.Label = null;
    //能量条倒计时屏幕边框
    @property(cc.Node) ShanKuang: cc.Node = null;
    //警告时的红色地圈
    @property(cc.Prefab) RedRound: cc.Prefab = null;
    //掉血时的红屏框
    @property(cc.Node) RedKuang: cc.Node = null;
    //全屏红的节点
    @property(cc.Node) RedCanvas: cc.Node = null;
    //新手引导节点
    @property(cc.Node) NoviceGuidance: cc.Node = null;
    //能量满了之后触发各种特效的控制器
    @property(powerFullcontrol) powerFull: powerFullcontrol = null;
    //特效表现的节点
    @property(EffectCon) EffectNode: EffectCon = null;

    
    //----- 属性声明 -----//
    //记录当前分数
    score: number = 0;
    //记录当前血量
    nowHP: number = lib.defConfig.MAXHP;
    //记录当前能量
    nowPOWER: number = 0;
    //记录当前时间剩余
    nowTIME: number = lib.defConfig.MAXTIME;
    //首次死亡
    firstDie: boolean = false;

    act1:cc.Action = cc.sequence(cc.moveTo(0.25,0,0),cc.moveTo(0.25,-540,0));
    act2:cc.Action = cc.sequence(cc.moveTo(0.25,0,0),cc.moveTo(0.25,540,0));
    //----- 生命周期 -----//

    // onLoad () {}

    start () {
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.ShowWarn,"showarn",this);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.HideWarn,"hidewarn",this);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.addHP,"addHP",this);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.clickBoss,"resetTIME",this);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.ShowClock,"ShowClock",this);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.HideClock,"HideClock",this);
        // this.schedule(this.minTIME,0.1,cc.macro.REPEAT_FOREVER,3);
        // this.schedule(this.minTIME,1,cc.macro.REPEAT_FOREVER,3);
    }

    // update (dt) {}

    onDestroy(){
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.ShowWarn,"showarn",this);
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.HideWarn,"hidewarn",this);
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.addHP,"addHP",this);
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.clickBoss,"resetTIME",this);
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.ShowClock,"ShowClock",this);
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.HideClock,"HideClock",this);
        // this.unschedule(this.minTIME);
    }
    //----- 按钮回调 -----//
    clickHelp(){
        // lib.msgEvent.getinstance().emit(lib.msgConfig.micbutton);
        this.HelpLayer.active = true;
    }

    closeHelp(){
        lib.msgEvent.getinstance().emit(lib.msgConfig.micbutton);
        this.HelpLayer.active = false;
        cc.director.resume();
    }

    clickShare(){
        lib.wxFun.shareAppMessage("好想要天上的星星!好，现在就给你摘!","res/raw-assets/pic/jietu.png");
        if(!this.firstDie)
        {
            lib.msgEvent.getinstance().emit(lib.msgConfig.Resurrection);
            this.OverLayer.active = false;
            this.pause();
            this.firstDie = true;
        }
        else
        {
            this.score *= 2;
            if(typeof wx !== 'undefined')
            {
                wx.postMessage({
                    message:'Submit' ,
                    MAIN_MENU_NUM: "score",
                    score:this.score,
                })
            }
            this.OverLayer.getChildByName("Share").active = false;
            if(this.score >= 0)
            {
                this.OverLayer.getChildByName("defen").getChildByName("score").getComponent(cc.Label).string = this.score.toString();
            }
            else
            {
                this.OverLayer.getChildByName("defen").getChildByName("score").getComponent(cc.Label).string = "/" + Math.abs(this.score).toString();
            }
            // cc.director.loadScene("startScene");
        }
    }

    //新手引导点击
    NoviceGuidanceClick(){
        // if(this.NoviceGuidance.getChildByName("mask1").active == true)
        // {
        //     this.showNoviceGuidanceMask2();
        // }
        // else if(this.NoviceGuidance.getChildByName("mask2").active == true)
        // {
        //     ShapeManager.getinstance().continueAllShape();
        //     this.NoviceGuidance.active = false;
        //     lib.msgEvent.getinstance().emit(lib.msgConfig.startClock);
        // }
        lib.msgEvent.getinstance().emit(lib.msgConfig.micbutton);
        this.HelpLayer.active = false;
        lib.msgEvent.getinstance().emit(lib.msgConfig.startClock);
    }
    //主页
    homePage(){
        cc.director.resume();
        lib.msgEvent.getinstance().emit(lib.msgConfig.micbutton);
        cc.director.loadScene("startScene");
    }

    //重新开始
    startGame(){
        lib.msgEvent.getinstance().emit(lib.msgConfig.micbutton);
        lib.msgEvent.getinstance().emit(lib.msgConfig.ReStart);
        this.score = 0;
        this.Socrelabel.string = this.score.toString();
        this.hidewarn();
        this.initHP();
        this.initPOWER();
        // touchInstance.getinstance().setCanMove(false);
        this.OverLayer.active = false;
        // this.ShanLayer.active = false;
        this.resetTIME();
        this.unschedule(this.minPOWER);
        ShapeManager.getinstance().clean();
    }

    //暂停
    pause(){
        lib.msgEvent.getinstance().emit(lib.msgConfig.micbutton);
        this.PauseLayer.active = true;
        cc.director.pause();
    }

    continue(){
        lib.msgEvent.getinstance().emit(lib.msgConfig.micbutton);
        this.PauseLayer.active = false;
        cc.director.resume();
    }
    //----- 事件回调 -----//
    //展示新手引导UI
    showNoviceGuidance(){
        this.NoviceGuidance.active = true;
    }
    //展示新手引导UI的第一个界面
    showNoviceGuidanceMask1(){
        this.NoviceGuidance.getChildByName("mask1").active = true;
        this.NoviceGuidance.getChildByName("mask2").active = false;
    }
    //展示新手引导UI的第二个界面
    showNoviceGuidanceMask2(){
        this.NoviceGuidance.getChildByName("mask1").active = false;
        this.NoviceGuidance.getChildByName("mask2").active = true;
    }
    checkMove(){
        if(this.getPowerIsFull())
        {
            // touchInstance.getinstance().setCanMove(true);
            this.schedule(this.minPOWER,0.01,500);
        }
    }

    gameover(labelType:number){
        if(typeof wx !== 'undefined')
        {
            wx.postMessage({
                message:'Submit' ,
                MAIN_MENU_NUM: "score",
                score:this.score,
            })
        }
        this.hidewarn();
        if(labelType == 1)
        {
            this.OverLayer.getChildByName("LabelPanel").getChildByName("Label").getComponent(cc.Label).string = lib.lanConfig.BombOverStr;
        }
        else
        {
            this.OverLayer.getChildByName("LabelPanel").getChildByName("Label").getComponent(cc.Label).string = lib.lanConfig.HPEmptyStr;
        }
        if(this.firstDie)
        {
            this.OverLayer.getChildByName("Share").getChildByName("label2").active = true;
            this.OverLayer.getChildByName("Share").getChildByName("label1").active = false;
        }
        else
        {
            this.OverLayer.getChildByName("Share").getChildByName("label1").active = true;
            this.OverLayer.getChildByName("Share").getChildByName("label2").active = false;
        }
        if(this.score >= 0)
        {
            this.OverLayer.getChildByName("defen").getChildByName("score").getComponent(cc.Label).string = this.score.toString();
        }
        else
        {
            this.OverLayer.getChildByName("defen").getChildByName("score").getComponent(cc.Label).string = "/" + Math.abs(this.score).toString();
        }
        this.OverLayer.active = true;
        cc.director.pause();
    }

    showarn(){
        if(this.warning)
        {
            this.warning.active = true;
            // this.warning.getChildByName("warningLabel").getComponent(cc.Label).string = num + "个星星正在来袭";
            //let act = cc.repeatForever(cc.sequence(cc.fadeIn(0.5),cc.delayTime(0.5),cc.fadeOut(0.5)));
            //this.warning.runAction(act);
            let round = cc.instantiate(this.RedRound);
            round.getComponent(cc.Animation).once('finished',()=>{
                round.destroy();
            },this)
            this.warning.addChild(round);
            this.schedule(()=>{
                let round = cc.instantiate(this.RedRound);
                round.getComponent(cc.Animation).once('finished',()=>{
                    round.destroy();
                },this)
                this.warning.addChild(round);
            },1,4);
        }
    }

    hidewarn(){
        if(this.warning)
        {
            this.warning.active = false;
        }
    }

    ShowClock(time:number){
        this.EffectNode.showClock(time);
    }

    HideClock(){
        this.EffectNode.hideClock();
    }
    //----- 公有方法 -----//
    //双倍分数特效
    doubleScore(){
        this.EffectNode.ShowDoubelScoreAni();
    }
    //治疗特效
    health(){
        for(let i = 0 ; i < 6 ; i++)
        {
            this.addHP();
        }
        this.EffectNode.ShowHealthAni();
        this.HPBar.blink();
    }
    //减速特效
    frozen(){
        this.EffectNode.ShowFrozenAni();
    }

    getHPIsFull(){
        if(this.nowHP >= lib.defConfig.MAXHP)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    getPowerIsFull(){
        if(this.nowPOWER >= lib.defConfig.MAXPOWER)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    addHP(num = 17){
        if(this.nowHP < lib.defConfig.MAXHP)
        {
            this.nowHP += 17;
            if(this.nowHP >= lib.defConfig.MAXHP)
            {
                this.nowHP = lib.defConfig.MAXHP;
            }
            this.HPBar.addHp(this.nowHP);
            this.RedKuang.stopActionByTag(1000);
            this.RedKuang.opacity = 0;
            this.RedKuang.active = false;
            this.RedCanvas.active = false;
            // this.HP.progress = parseFloat((this.nowHP / lib.defConfig.MAXHP).toString());
            // this.RedLayer.x = this.HP.progress * this.HP.totalLength - 50;
            // // this.RedLayer.width -= (1 / lib.defConfig.MAXHP) * this.HP.totalLength;
            // if(this.RedLayer.width < 0)
            // {
            //     this.RedLayer.width = 0;
            // }
        }
    }

    showHPBarLockAni(){
        this.HPBar.showHPBarLockAni();
    }

    initHP(){
        this.RedKuang.stopActionByTag(1000);
        this.RedKuang.opacity = 0;
        this.RedKuang.active = false;
        this.RedCanvas.active = false;
        this.nowHP = lib.defConfig.MAXHP;
        this.HPBar.initHPBar();
        // this.HP.progress = 1;
        // this.RedLayer.width = 0;
    }

    minHP(num = 17,showRed = true){
        if(this.nowHP == 0)
        {
            return;
        }
        this.nowHP -= num;
        this.HPBar.minHp(this.nowHP);
        // this.HP.progress = parseFloat((this.nowHP / lib.defConfig.MAXHP).toString());
        // this.RedLayer.x = this.HP.progress * this.HP.totalLength - 50;
        // this.RedLayer.width += (1 / lib.defConfig.MAXHP) * this.HP.totalLength;
        if(showRed)
        {
            lib.msgEvent.getinstance().emit(lib.msgConfig.micMinHP);
            if(this.nowHP > 17)
            {
                let act = cc.sequence(cc.fadeIn(0.35),cc.fadeOut(0.35),cc.callFunc(()=>{
                    this.RedCanvas.active = false;
                    this.RedKuang.active = false;
                }));
                this.RedKuang.active = true;
                this.RedCanvas.active = true;
                this.RedKuang.runAction(act);
            }
        }
        if(this.nowHP <= 17)
        {
            this.RedKuang.active = true;
            this.RedCanvas.active = true;
            let act = cc.fadeIn(0.35);
            act.setTag(1000);
            this.RedKuang.runAction(act);
        } 
        if(this.nowHP <= 0)
        {
            lib.msgEvent.getinstance().emit(lib.msgConfig.OverGame);
        }
    }

    initPOWER(){
        this.nowPOWER = 0;
        // this.POWER.progress = 0;
        this.ShanKuang.getChildByName("dingkuang1").height = 0;
        this.ShanKuang.getChildByName("dingkuang2").height = 0;
        this.ShanKuang.getChildByName("dingkuang1").stopAllActions();
        this.ShanKuang.getChildByName("dingkuang1").opacity = 255;
        this.ShanKuang.getChildByName("dingkuang2").stopAllActions();
        this.ShanKuang.getChildByName("dingkuang2").opacity = 255;
        this.ShanKuang.getChildByName("tips").active = false;
    }

    addScore(score:number){
        this._addScore(score);
        this.resetTIME();
        // if(touchInstance.getinstance().getCanMove())
        // {
        //     return;
        // }
        // let temp = score / 50;
    }

    minTIME(){
        if(this.nowTIME <= 0)
        {
            return;
        }
        if(this.warning.active == true)
        {
            return;
        }
        this.nowTIME--;
        if(this.nowTIME <= 3)
        {
            this.Timelabel.string = this.nowTIME.toString();
            this.Timelabel.node.active = true;
            this.Timelabel.node.parent.getComponent(cc.Animation).play();
        }
        if(this.nowTIME <= 0)
        {
            this.minHP();
            this.resetTIME();
        }
    }

    addPOWER(num:number){
        if(this.ShanKuang.getChildByName("tips").active)
        {
            return;
        }
        this.nowPOWER += num;
        if(this.nowPOWER >= lib.defConfig.MAXPOWER)
        {
            this.nowPOWER = lib.defConfig.MAXPOWER;
        }
        // this.POWER.progress = parseFloat((this.nowPOWER / lib.defConfig.MAXPOWER).toString());
        // if(this.nowPOWER == lib.defConfig.MAXPOWER)
        // {
        // this.ShanLayer.active = true;
        // this.ShanKuang.active = true;
        this.ShanKuang.getChildByName("dingkuang1").height = 1920 * parseFloat((this.nowPOWER / lib.defConfig.MAXPOWER).toString());
        this.ShanKuang.getChildByName("dingkuang2").height = 1920 * parseFloat((this.nowPOWER / lib.defConfig.MAXPOWER).toString());
        if(this.nowPOWER == lib.defConfig.MAXPOWER)
        {
            this.PowerFullAni(this.powerFull.CreateSpecial());
        }
            // let act = cc.repeatForever(cc.sequence(cc.fadeIn(0.5),cc.fadeOut(0.5)));
            // this.ShanLayer.runAction(act);
        // }
    }

    //----- 私有方法 -----//
    private PowerFullAni(Effectinfo:_kits.PowerFull.EffectInfo){
        this.ShanKuang.getChildByName("tips").active = true;
        this.ShanKuang.getChildByName("tips").getComponent(cc.Label).string = Effectinfo.Name;
        let dingkuang1 = this.ShanKuang.getChildByName("dingkuang1");
        let dingkuang2 = this.ShanKuang.getChildByName("dingkuang2");
        dingkuang1.runAction(this.act1);
        dingkuang2.runAction(this.act2);
        this.schedule(this.minPOWER,Effectinfo.time / 50,50,0.5);
    }
    private _addScore(score:number){
        this.score += score;
        let subscore = this.Socrelabel.node.getChildByName("subscore");
        if(this.score >= 0)
        {
            this.Socrelabel.string = this.score.toString();
            subscore.getComponent(cc.Label).string = this.score.toString();
        }
        else
        {
            this.Socrelabel.string = "/" + Math.abs(this.score).toString();
            subscore.getComponent(cc.Label).string = "/" + Math.abs(this.score).toString();
        }
        subscore.getComponent(cc.Animation).play();
    }

    private minPOWER(){
        if(this.nowPOWER <= 0)
        {
            return;
        }
        this.nowPOWER -= 10;
        // this.POWER.progress = parseFloat((this.nowPOWER / lib.defConfig.MAXPOWER).toString());
        this.ShanKuang.getChildByName("dingkuang1").height = 1920 * parseFloat((this.nowPOWER / lib.defConfig.MAXPOWER).toString());
        this.ShanKuang.getChildByName("dingkuang2").height = 1920 * parseFloat((this.nowPOWER / lib.defConfig.MAXPOWER).toString());
        // this.ShanLayer.width = this.POWER.progress * this.POWER.totalLength;
        if(this.nowPOWER <= 0)
        {
            // this.ShanKuang.active = false;
            // this.ShanLayer.active = false;
            // this.ShanKuang.getChildByName("dingkuang1").opacity = 255;
            // this.ShanKuang.getChildByName("dingkuang2").opacity = 255;
            // touchInstance.getinstance().setCanMove(false);
            this.ShanKuang.getChildByName("tips").active = false;
        }
    }

    private resetTIME(){
        this.nowTIME = lib.defConfig.MAXTIME;
        this.Timelabel.node.active = false;
        // this.TIME.progress = parseFloat((this.nowTIME / lib.defConfig.MAXTIME).toString());
    }

    // private minTIME(){
    //     if(this.nowTIME <= 0)
    //     {
    //         return;
    //     }
    //     if(this.warning.active == true)
    //     {
    //         return;
    //     }
    //     this.nowTIME--;
    //     this.TIME.progress = parseFloat((this.nowTIME / lib.defConfig.MAXTIME).toString());
    //     if(this.nowTIME <= 0)
    //     {
    //         this.minHP();
    //         this.resetTIME();
    //     }
    // }
}
