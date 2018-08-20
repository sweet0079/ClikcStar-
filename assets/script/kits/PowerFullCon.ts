/** 满能量触发特效控制 */
import * as lib from '../lib/lib'
import ShapeManager from './ShapeManager'
import UIControl from './UIControl'
import { _kits } from '../../../libdts/kits';

const {ccclass, property} = cc._decorator;

@ccclass
export default class PowerFullControl extends cc.Component {

    //----- 编辑器属性 -----//
    //UI控制组件
    @property(cc.Node) UIcon: cc.Node = null;
    //----- 属性声明 -----//
    //----- 生命周期 -----//

    // onLoad () {}

    //start () {}

    // update (dt) {}

    //onDestroy(){}

    //----- 按钮回调 -----//
    //----- 事件回调 -----//
    //----- 公有方法 -----//
    CreateSpecial(){
        let temp = lib.RandomParameters.RandomParameters.getRandomInt(100);
        let str:string = "";
        let time:number = 0;
        // 10%几率负面效果
        if(temp < 10)
        {
            let temp = parseInt((cc.random0To1() * (lib.defConfig.negitiveBuff.length)).toString());
            switch(temp)
            {
                case lib.defConfig.negitiveBuff.createBomb:
                    this.createBomb();
                    str = "制造炸弹";
                    time = 1;
                    break;
                case lib.defConfig.negitiveBuff.small:
                    this.SmallShape();
                    str = "缩小形状";
                    time = 5;
                    break;
                default:
                    console.log("fumian");
                    break;
            }
        }
        //30%几率正面效果
        else if(temp < 30)
        {
            let temp = parseInt((cc.random0To1() * (lib.defConfig.positiveBuff.length)).toString());
            switch(temp)
            {
                case lib.defConfig.positiveBuff.allClean:
                    this.CleanAll();
                    str = "清屏一次";
                    time = 1;
                    break;
                case lib.defConfig.positiveBuff.doubleScore:
                    this.DoubleScore();
                    str = "双倍分数";
                    time = 5;
                    break;
                case lib.defConfig.positiveBuff.health:
                    this.Health();
                    str = "回满电量";
                    time = 1;
                    break;
                case lib.defConfig.positiveBuff.frozen:
                    this.frozen();
                    str = "减速";
                    time = 5;
                    break;
                case lib.defConfig.positiveBuff.assimilation:
                    this.assimilation();
                    str = "同化形状";
                    time = 2;
                    break;
                case lib.defConfig.positiveBuff.big:
                    this.BigShape();
                    str = "放大形状";
                    time = 5;
                    break;
                default:
                    break;
            }
        }
        //60%几率套路效果
        else
        {
            lib.msgEvent.getinstance().emit(lib.msgConfig.StartWeave,parseInt((cc.random0To1() * (lib.defConfig.Tricks.length)).toString()));
            str = "套路来袭";
            time = 2;
        }
        // this.assimilation();
        let effectinfo: _kits.PowerFull.EffectInfo = {
            Name: str,
            time: time,
        }
        return effectinfo;
    }
    //----- 私有方法 -----//
    //减益
    /** 制造炸弹 */
    private createBomb(){
        lib.msgEvent.getinstance().emit(lib.msgConfig.negitiveBomb);
    }

    /** 缩小所有形状 */
    private SmallShape(){
        ShapeManager.getinstance().setsmall(true);
        this.scheduleOnce(()=>{
            ShapeManager.getinstance().setsmall(false);
        },5);
        this.UIcon.getComponent(UIControl).frozen();
    }

    //增益
    /** 同化 */
    private assimilation(){
        ShapeManager.getinstance().assimilationNoreShape();
        this.scheduleOnce(()=>{
            ShapeManager.getinstance().setassimilation(false);
        },2);
    }

    /** 放大所有形状 */
    private BigShape(){
        ShapeManager.getinstance().setbig(true);
        this.scheduleOnce(()=>{
            ShapeManager.getinstance().setbig(false);
        },5);
        this.UIcon.getComponent(UIControl).frozen();
    }

    /** 清屏 */
    private CleanAll(){
        ShapeManager.getinstance().desNormalShape();
    }

    /** 减速 */
    private frozen(){
        ShapeManager.getinstance().setFrozen(true);
        this.scheduleOnce(()=>{
            ShapeManager.getinstance().setFrozen(false);
        },5);
        this.UIcon.getComponent(UIControl).frozen();
    }

    /** 回血 */
    private Health(){
        this.UIcon.getComponent(UIControl).health();
    }

    /** 双倍加分 */
    private DoubleScore(){
        ShapeManager.getinstance().setDoubleScore(true);
        this.scheduleOnce(()=>{
            ShapeManager.getinstance().setDoubleScore(false);
        },5);
        this.UIcon.getComponent(UIControl).doubleScore();
    }
}
