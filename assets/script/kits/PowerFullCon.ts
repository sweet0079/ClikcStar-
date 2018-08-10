/** 满能量触发特效控制 */
import * as lib from '../lib/lib'
import ShapeManager from './ShapeManager'
import UIControl from './UIControl'

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
        // 25%几率负面效果
        if(temp < 25)
        {
            let temp = parseInt((cc.random0To1() * (lib.defConfig.negitiveBuff.length)).toString());
            switch(temp)
            {
                default:
                    console.log("fumian");
                    break;
            }
        }
        //75%几率正面效果
        else
        {
            let temp = parseInt((cc.random0To1() * (lib.defConfig.positiveBuff.length)).toString());
            switch(temp)
            {
                case lib.defConfig.positiveBuff.allClean:
                    this.CleanAll();
                    break;
                case lib.defConfig.positiveBuff.doubleScore:
                    this.DoubleScore();
                    break;
                case lib.defConfig.positiveBuff.health:
                    this.Health();
                    break;
                case lib.defConfig.positiveBuff.frozen:
                    this.frozen();
                    break;
                case lib.defConfig.positiveBuff.assimilation:
                    this.assimilation();
                    break;
                default:
                    break;
            }
        }
        // this.assimilation();
    }
    //----- 私有方法 -----//
    private assimilation(){
        ShapeManager.getinstance().assimilationNoreShape();
    }

    private CleanAll(){
        ShapeManager.getinstance().desNormalShape();
    }

    private frozen(){
        ShapeManager.getinstance().setFrozen(true);
        this.scheduleOnce(()=>{
            ShapeManager.getinstance().setFrozen(false);
        },5);
        this.UIcon.getComponent(UIControl).frozen();
    }

    private Health(){
        this.UIcon.getComponent(UIControl).health();
    }

    private DoubleScore(){
        ShapeManager.getinstance().setDoubleScore(true);
        this.scheduleOnce(()=>{
            ShapeManager.getinstance().setDoubleScore(false);
        },5);
        this.UIcon.getComponent(UIControl).doubleScore();
    }
}
