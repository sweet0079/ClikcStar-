
const {ccclass, property} = cc._decorator;

@ccclass
export default class EffectControl extends cc.Component {

    //----- 编辑器属性 -----//
    @property(cc.Animation) Health: cc.Animation = null;
    @property(cc.ProgressBar) DoubleLabel: cc.ProgressBar = null;
    @property(cc.ProgressBar) FrozenPB: cc.ProgressBar = null;
    @property(cc.ProgressBar) BossPB: cc.ProgressBar = null;
    //----- 属性声明 -----//
    //----- 生命周期 -----//
    //----- 按钮回调 -----//
    //----- 事件回调 -----//
    //----- 公有方法 -----//
    ShowHealthAni(){
        this.Health.node.active = true;
        this.Health.on('finished',()=>{
            this.Health.node.active = false;
        },this);
        this.Health.play();
    }
    ShowDoubelScoreAni(){
        this.DoubleLabel.node.active = true;
        this.DoubleLabel.progress = 1;
        this.schedule(()=>{
            this.DoubleLabel.progress -= 0.01;
            if(this.DoubleLabel.progress <= 0.01)
            {
                this.DoubleLabel.node.active = false;
            }
        },0.05,100);
    }
    
    ShowFrozenAni(){
        this.FrozenPB.node.parent.active = true;
        this.FrozenPB.progress = 1;
        this.schedule(()=>{
            this.FrozenPB.progress -= 0.01;
            if(this.FrozenPB.progress <= 0.01)
            {
                this.FrozenPB.node.parent.active = false;
            }
        },0.05,100);
    }

    showClock(time:number){
        this.BossPB.node.parent.active = true;
        this.BossPB.progress = 1;
        this.schedule(()=>{
            this.BossPB.progress -= 1 / (time / 0.05);
            if(this.BossPB.progress <= 0.01)
            {
                this.BossPB.node.parent.active = false;
            }
        },0.05,time / 0.05);
    }

    hideClock(time:number){
        this.BossPB.node.parent.active = false;
    }
    //----- 私有方法 -----//


}
