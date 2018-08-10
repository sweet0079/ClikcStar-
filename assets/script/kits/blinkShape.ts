/** 用于控制闪烁形状的渐隐和自消散 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class BlinkShape extends cc.Component {
    /** 默认闪烁频率 */
    @property({tooltip:"多少秒闪烁一次", type: cc.Float }) blinkFrequency:number = 1;
    /** 自我消散时间 */
    @property({tooltip:"自我消散时间", type: cc.Float }) dissTime:number = 5;
    //----- 生命周期 -----//
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.blink();
        this.SelfDissipation();
    }

    // update (dt) {}
    //----- 私有方法 -----//
    private SelfDissipation(){
        if(this.dissTime > 0)
        {
            this.scheduleOnce(()=>{
                this.node.destroy();
            },this.dissTime);
        }
    }

    //闪烁
    private blink(){
        this.node.opacity = 0;
        let act1 = cc.fadeIn(this.blinkFrequency / 2);
        let act2 = cc.fadeOut(this.blinkFrequency / 2);
        let act = cc.sequence(act1,act2);
        let rep = cc.repeatForever(act);
        this.node.runAction(rep);
    }
}
