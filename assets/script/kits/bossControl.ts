/** boss控制 */
import * as lib from '../lib/lib'
import BossTimeInstance from './BossTimeInstance';

const {ccclass, property} = cc._decorator;

@ccclass
export default class bossControl extends cc.Component {

    //----- 编辑器属性 -----//
    //血量显示
    @property(cc.Label) HPlabel: cc.Label = null;

    //----- 属性声明 -----//
    /** boss血量 */
    private _hp:number = 20;
    /** boss吸收分数 */
    private _score:number = 0;
    //----- 生命周期 -----//
    // onLoad () {}

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START,(event:cc.Event.EventTouch)=>{
            this.ClickBoss(event);
        });
        this.node.y = 1080;
        let act = cc.moveTo(lib.defConfig.BossComingTime,0,0);
        this.node.runAction(act);
        this.scheduleOnce(()=>{
            this.Leave();
        },lib.defConfig.BossLivingTime + lib.defConfig.BossComingTime);
    }

    update (dt) {
        BossTimeInstance.getinstance().setbossPos(this.node.getPosition());
    }
    onDestroy(){
        this.node.off(cc.Node.EventType.TOUCH_START,(event:cc.Event.EventTouch)=>{
            this.ClickBoss(event);
        });
    }
    //----- 公有方法 -----//
    onCollisionEnter(other, self)
    {
        this._score++;
    }
    //----- 事件回调 -----//
    //----- 私有方法 -----//
    private ClickBoss(event:cc.Event.EventTouch){
        this.minHP();
        lib.msgEvent.getinstance().emit(lib.msgConfig.clickBoss);
        if(this._hp <= 0)
        {
            this.die();
        }
    }

    private Leave(){
        let move = cc.moveTo(lib.defConfig.BossComingTime,0,1080);
        let rota = cc.rotateBy(2,900);
        let seq = cc.sequence(move,cc.callFunc(()=>{
            this.node.destroy();
            BossTimeInstance.getinstance().setisBossTime(false);
        }));
        let spawn = cc.spawn(seq,rota);
        spawn.setTag(99);
        this.node.runAction(spawn);
        // this.node.runAction(rota);
    }

    private minHP(){
        this._hp--;
        this.HPlabel.string = this._hp.toString();
    }

    private die(){
        this.node.getComponent(cc.BoxCollider).destroy();
        this.node.stopActionByTag(99);
        this.node.getComponent(cc.Animation).once('finished',()=>{
            this.node.destroy();
        },this);
        this.node.getComponent(cc.Animation).play("BossDie");
        BossTimeInstance.getinstance().setisBossTime(false);
    }
}
