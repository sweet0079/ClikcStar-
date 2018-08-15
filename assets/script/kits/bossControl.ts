/** boss控制 */
import * as lib from '../lib/lib'
import BossTimeInstance from './BossTimeInstance';
import { _kits } from '../../../libdts/kits';

const {ccclass, property} = cc._decorator;

@ccclass
export default class bossControl extends cc.Component {

    //----- 编辑器属性 -----//
    //血量显示
    @property(cc.Label) HPlabel: cc.Label = null;
    //烟花
    @property(cc.Prefab) FWprefab: cc.Prefab = null;

    //----- 属性声明 -----//
    /** boss血量 */
    private _hp: number = 15;
    /** boss吸收分数 */
    private _score: number = 0;
    /** boss速度 */
    private _speed: number = 300;
    /** boss移动的目标位置 */
    private _NextPos: cc.Vec2 = cc.v2(0,0);
    //----- 生命周期 -----//
    // onLoad () {}

    start () {
        this.HPlabel.string = this._hp.toString();
        this.node.on(cc.Node.EventType.TOUCH_START,(event:cc.Event.EventTouch)=>{
            this.ClickBoss(event);
        });
        this.node.y = 1080;
        this.scheduleOnce(this.Leave,lib.defConfig.BossLivingTime + lib.defConfig.BossComingTime);
    }

    update (dt) {
        BossTimeInstance.getinstance().setbossPos(this.node.getPosition());
        this.flyToPoint(dt,this._NextPos);
        if(this.AboutEqualPos(this.node.getPosition(),this._NextPos))
        {
            this._NextPos = this.GetRandomPos();
        }
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
        this._speed += 10;
    }
    //----- 事件回调 -----//
    //----- 私有方法 -----//
    private ClickBoss(event:cc.Event.EventTouch){
        if(this._hp == 0)
        {
            return;
        }
        this.minHP();
        lib.msgEvent.getinstance().emit(lib.msgConfig.clickBoss);
        if(this._hp <= 0)
        {
            this.die();
        }
    }

    private Leave(){
        this._speed = 0;
        let move = cc.moveTo(lib.defConfig.BossComingTime,0,1080);
        let seq = cc.sequence(move,cc.callFunc(()=>{
            this.node.destroy();
            BossTimeInstance.getinstance().setisBossTime(false);
        }));
        seq.setTag(99);
        this.node.runAction(seq);
        // this.node.runAction(rota);
    }

    private minHP(){
        this._hp--;
        this.HPlabel.string = this._hp.toString();
    }

    private die(){
        this._speed = 0;
        this.unschedule(this.Leave);
        this.node.getComponent(cc.BoxCollider).destroy();
        BossTimeInstance.getinstance().setisBossTime(false);
        if(this._score == 0)
        {
            this.node.destroy(); 
        }
        // for(let i = 0 ; i < this._score ; i++)
        // {
        //     console.log("i = " + i);
        //     this.scheduleOnce(()=>{
        //         this.createFireWork();
        //     },0.1 * i);
        //     if(i == this._score - 1)
        //     {
        //         this.node.destroy();
        //     }
        // }
        this.schedule(()=>{
            this.createFireWork();
        },0.15,this._score);
        this.scheduleOnce(()=>{
            this.node.destroy();
        },this._score * 0.15);
        this.node.stopActionByTag(99);
        // this.node.getComponent(cc.Animation).once('finished',()=>{
        //     this.node.destroy();
        // },this);
        // this.node.getComponent(cc.Animation).play("BossDie");
        // let shapInfo:_kits.ClickShape.ScoreInfo = {
        //     score: this._score * 100,
        //     shape: 3,
        //     isSpecial: true,
        // }
        // lib.msgEvent.getinstance().emit(lib.msgConfig.clickStart,shapInfo);
        // lib.msgEvent.getinstance().emit(lib.msgConfig.Settlement);
        // lib.msgEvent.getinstance().emit(lib.msgConfig.ShowScore,cc.v2(this.node.getPositionX(),this.node.getPositionY()));
    }

    private createFireWork(){
        let fireWork = cc.instantiate(this.FWprefab);
        fireWork.setPosition(this.node.getPosition());
        let endpos = new cc.Vec2(lib.RandomParameters.RandomParameters.getRandomInt(1080,-540),lib.RandomParameters.RandomParameters.getRandomInt(1920,-960));
        let act = cc.moveTo(0.5,endpos);
        let seq = cc.sequence(act,cc.callFunc(()=>{
            let shapInfo:_kits.ClickShape.ScoreInfo = {
                score: 100,
                shape: 3,
                isSpecial: true,
            }
            lib.msgEvent.getinstance().emit(lib.msgConfig.clickStart,shapInfo);
            lib.msgEvent.getinstance().emit(lib.msgConfig.Settlement);
            lib.msgEvent.getinstance().emit(lib.msgConfig.ShowScore,cc.v2(fireWork.getPositionX(),fireWork.getPositionY()));
            fireWork.getComponent(cc.Animation).play("FwDiss");
        }));
        fireWork.parent = this.node.parent;
        fireWork.runAction(seq);
    }

    private GetRandomPos(){
        let limitWidth = 1080 - this.node.width * this.node.scale;
        let limitHeight = 1920 - this.node.height * this.node.scale;
        let Randompos = new cc.Vec2(lib.RandomParameters.RandomParameters.getRandomInt(limitWidth,-limitWidth / 2)
                                    ,lib.RandomParameters.RandomParameters.getRandomInt(limitHeight,-limitHeight / 2));
        return Randompos;
    }

    private AboutEqualPos(posA:cc.Vec2,posB:cc.Vec2){
        if(Math.abs(posA.x - posB.x) < 10
        && Math.abs(posA.y - posB.y) < 10)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    //飞向某个点
    private flyToPoint(dt,pos:cc.Vec2){
        if(this.node.x == pos.x)
        {
            if(this.node.y > pos.y)
            {
                this.node.y -= this._speed * dt;
            }
            else
            {
                this.node.y += this._speed * dt;
            }
        }
        else
        {
            let angle = Math.atan((this.node.y - pos.y) / (this.node.x - pos.x));
            if(this.node.x < pos.x)
            {
                this.node.x += this._speed * dt * Math.cos(angle);
                this.node.y += this._speed * dt * Math.sin(angle);
            }
            else
            {
                this.node.x -= this._speed * dt * Math.cos(angle);
                this.node.y -= this._speed * dt * Math.sin(angle);
            }
        }
    }
}
