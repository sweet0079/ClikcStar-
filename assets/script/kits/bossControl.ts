/** boss控制 */
import * as lib from '../lib/lib'
import BossTimeInstance from './BossTimeInstance';
import bosshpcontrol from './bossHPControl'
import { _kits } from '../../../libdts/kits';

const {ccclass, property} = cc._decorator;

@ccclass
export default class bossControl extends cc.Component {

    //----- 编辑器属性 -----//
    //血量显示
    @property(bosshpcontrol) HPNode: bosshpcontrol = null;
    //烟花
    @property(cc.Prefab) FWprefab: cc.Prefab = null;
    //星星被点击特效
    @property(cc.Prefab) StarDiss: cc.Prefab = null;

    //----- 属性声明 -----//
    /** boss血量 */
    private _hp: number = 15;
    /** boss吸收分数 */
    private _score: number = 0;
    /** boss速度 */
    private _speed: number = 300;
    /** boss时间 */
    private _time: number = 0;
    /** boss速度上限 */
    private _speedUpperLimit: number = 600;
    /** boss移动的目标位置 */
    private _NextPos: cc.Vec2 = cc.v2(0,0);
    /** boss已激活的血条 */
    private _HPStarArr: Array<cc.Node> = [];
    //----- 生命周期 -----//
    // onLoad () {}

    start () {
        // this.HPlabel.string = this._hp.toString();
        this.node.on(cc.Node.EventType.TOUCH_START,(event:cc.Event.EventTouch)=>{
            this.ClickBoss(event);
        });
        this.node.y = 1080;
        this.scheduleOnce(this.Leave,lib.defConfig.BossLivingTime + lib.defConfig.BossComingTime);
    }

    update (dt) {
        // this._time += dt;
        // if(this._time > lib.defConfig.BossLivingTime + lib.defConfig.BossComingTime)
        // {
        //     this.Leave();
        // }
        BossTimeInstance.getinstance().setbossPos(this.node.getPosition());
        this.flyToPoint(dt,this._NextPos);
        if(this.AboutEqualPos(this.node.getPosition(),this._NextPos))
        {
            this._NextPos = this.GetRandomPos();
        }
    }
    onDestroy(){
        // this.node.off(cc.Node.EventType.TOUCH_START,(event:cc.Event.EventTouch)=>{
        //     this.ClickBoss(event);
        // });
    }
    //----- 公有方法 -----//
    setHP(num:number)
    {
        this._hp = num;
        this.HPNode.setHp(this._hp);
        this.initHP();
    }
    onCollisionEnter(other, self)
    {
        this._score++;
        if(this._speed < this._speedUpperLimit)
        {
            this._speed += 30;
        }
    }
    //----- 事件回调 -----//
    private pause(){
        this.unschedule(this.clockFun);
        this._weaveControl.unscheduleAllCallbacks();
    }

    private continue(){
        this.schedule(this.clockFun,0.5);
    }
    //----- 私有方法 -----//
    /** 点击boss效果 */
    private ClickEffect(){
        let act1 = cc.scaleTo(0.05,1.75);
        let act2 = cc.scaleTo(0.05,2);
        let seq = cc.sequence(act1,act2);
        this.node.runAction(seq);
        // let act1 = cc.scaleTo(0.05,0.75);
        // let act2 = cc.scaleTo(0.05,1);
        // let seq = cc.sequence(act1,act2);
        // this.node.getChildByName("boss").runAction(seq);
        // act1 = cc.scaleTo(0.05,1);
        // act2 = cc.scaleTo(0.05,1.2);
        // seq = cc.sequence(act1,act2);
        // this.node.getChildByName("star").runAction(seq);
    }

    /** 点击boss方法 */
    private ClickBoss(event:cc.Event.EventTouch){
        if(this._hp == 0)
        {
            return;
        }
        lib.msgEvent.getinstance().emit(lib.msgConfig.micClickStart);
        this.minHP();
        this.ClickEffect();
        lib.msgEvent.getinstance().emit(lib.msgConfig.clickBoss);
        if(this._hp <= 0)
        {
            this.die();
        }
    }

    
    /** boss没有被点死 */
    private Leave(){
        // this._speed = 0;
        // let move = cc.moveTo(lib.defConfig.BossComingTime,0,1080);
        // let seq = cc.sequence(move,cc.callFunc(()=>{
        //     this.node.destroy();
        //     BossTimeInstance.getinstance().setisBossTime(false);
        // }));
        // seq.setTag(99);
        // this.node.runAction(seq);
        // // this.node.runAction(rota);
        let act = cc.spawn(cc.scaleTo(lib.defConfig.BossDieTime,0),cc.moveTo(lib.defConfig.BossDieTime,0,0));
        for(let i = 0; i < this.HPNode.node.childrenCount; i++)
        {
            this.HPNode.node.children[i].runAction(act.clone());
        }
        this.die(-50);
    }

    /** 初始化boss血量 */
    private initHP(){
        for(let i = 0; i < this.HPNode.node.childrenCount; i++)
        {
            if(this.HPNode.node.children[i].active == true)
            {
                this._HPStarArr.push(this.HPNode.node.children[i]);
            }
        }
        this._hp = this._HPStarArr.length;
    }

    /** boss血量下降 */
    private minHP(){
        let index = this._hp - 1;
        let act = cc.sequence(cc.scaleTo(0.1,0.7),cc.scaleTo(0.2,0),cc.callFunc(()=>{
            this._HPStarArr[index].active = false;
        }));
        this._HPStarArr[index].runAction(act);
        this._hp--;
        let dissAniNode = cc.instantiate(this.StarDiss);
        dissAniNode.parent = this.node;
        // this.HPlabel.string = this._hp.toString();
    }

    /** boss死亡特效 */
    private dieEffect(){
        lib.msgEvent.getinstance().emit(lib.msgConfig.micBossDie);
        this.node.getChildByName("boss1").active = true;
        this.node.getChildByName("boss1").rotation = this.node.getChildByName("boss").rotation;
        this.node.getChildByName("boss2").active = true;
        this.node.getChildByName("boss2").rotation = this.node.getChildByName("boss").rotation;
        this.node.getChildByName("star").runAction(cc.scaleTo(lib.defConfig.BossDieTime,0));
        let fade = cc.fadeOut(lib.defConfig.BossDieTime);
        this.node.getChildByName("boss").runAction(fade.clone());
        this.node.getChildByName("boss1").runAction(fade.clone());
        this.node.getChildByName("boss2").runAction(fade.clone());
    }

    /** boss死亡 */
    private die(num:number = 100){
        lib.msgEvent.getinstance().emit(lib.msgConfig.stopLockHPAni);
        lib.msgEvent.getinstance().emit(lib.msgConfig.addHP,50);
        this.node.off(cc.Node.EventType.TOUCH_START,(event:cc.Event.EventTouch)=>{
            this.ClickBoss(event);
        });
        lib.msgEvent.getinstance().emit(lib.msgConfig.HideClock);
        this._speed = 0;
        this.unschedule(this.Leave);
        this.node.getComponent(cc.BoxCollider).destroy();
        if(this._score == 0)
        {
            this.scheduleOnce(()=>{
                this.node.destroy(); 
            },lib.defConfig.BossDieTime);
        }
        if(num > 0)
        {
            let shapInfo:_kits.ClickShape.ScoreInfo = {
                score: 1000,
                shape: 3,
                isSpecial: true,
            }
            lib.msgEvent.getinstance().emit(lib.msgConfig.clickStart,shapInfo);
            lib.msgEvent.getinstance().emit(lib.msgConfig.Settlement,false);
            lib.msgEvent.getinstance().emit(lib.msgConfig.ShowScore,cc.v2(this.node.x,this.node.y + 100));
        }
        this.dieEffect();
        this.scheduleOnce(()=>{
            BossTimeInstance.getinstance().setisBossTime(false);
        },0.5);
        this.schedule(()=>{
            this.createFireWork(num);
        },0.05,this._score,lib.defConfig.BossDieTime);
        this.scheduleOnce(()=>{
            this.node.destroy();
        },this._score * 0.05 + lib.defConfig.BossDieTime);
        this.node.stopActionByTag(99);
    }

    /** boss死亡时创建的飞出的小星星 */
    private createFireWork(num:number){
        let fireWork = cc.instantiate(this.FWprefab);
        fireWork.setPosition(this.node.getPosition());
        let endpos = new cc.Vec2(lib.RandomParameters.RandomParameters.getRandomInt(1080,-540),lib.RandomParameters.RandomParameters.getRandomInt(1920,-960));
        let act = cc.moveTo(0.5,endpos);
        let seq = cc.sequence(act,cc.callFunc(()=>{
            let shapInfo:_kits.ClickShape.ScoreInfo = {
                score: num,
                shape: 3,
                isSpecial: true,
            }
            lib.msgEvent.getinstance().emit(lib.msgConfig.clickStart,shapInfo);
            lib.msgEvent.getinstance().emit(lib.msgConfig.Settlement,false);
            lib.msgEvent.getinstance().emit(lib.msgConfig.ShowScore,cc.v2(fireWork.getPositionX(),fireWork.getPositionY()));
            fireWork.getComponent(cc.Animation).play("FwDiss");
        }));
        fireWork.parent = this.node.parent;
        fireWork.runAction(seq);
    }

    /** 获取随机位置 */
    private GetRandomPos(){
        let limitWidth = 1080 - this.node.width * this.node.scale;
        let limitHeight = 1920 - this.node.height * this.node.scale;
        let Randompos = new cc.Vec2(lib.RandomParameters.RandomParameters.getRandomInt(limitWidth,-limitWidth / 2)
                                    ,lib.RandomParameters.RandomParameters.getRandomInt(limitHeight,-limitHeight / 2));
        return Randompos;
    }

    /** 判断两个坐标是否相近的方法 */
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
