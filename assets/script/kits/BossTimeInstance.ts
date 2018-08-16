/** 控制是否是boss时间的单例 */
import * as lib from '../lib/lib'

export default class BossTimeInstance {
    static instance: BossTimeInstance
    /** 获取单例 */
    static getinstance() {
        if (BossTimeInstance.instance) return BossTimeInstance.instance;
        else return new BossTimeInstance();
    }
    /** 返回一个新的单例 */
    static newinstance() {
        return new BossTimeInstance();
    }

    private constructor() {
        this.isBossTime = false;
        this.bossPos = new cc.Vec2(0,0);
        cc.director.getCollisionManager().enabled = true;
        BossTimeInstance.instance = this;
    }

    private isBossTime: boolean;
    private bossPos: cc.Vec2;

    getbossPos(){
        return this.bossPos;
    }

    setbossPos(pos:cc.Vec2){
        this.bossPos = pos;
    }

    getisBossTime(){
        return this.isBossTime;
    }

    setisBossTime(flag:boolean){
        this.isBossTime = flag;
        if(flag == false)
        {
            this.bossPos = new cc.Vec2(0,0);
            lib.msgEvent.getinstance().emit(lib.msgConfig.micPlayBGM);
        }
        else
        {
            lib.msgEvent.getinstance().emit(lib.msgConfig.micPlayBossBGM);
        }
    }
}