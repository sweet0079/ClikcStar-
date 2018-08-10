/** 控制点击和滑动的单例 */
import * as lib from '../lib/lib'

export default class touchInstance {
    static instance: touchInstance
    /** 获取单例 */
    static getinstance() {
        if (touchInstance.instance) return touchInstance.instance;
        else return new touchInstance();
    }
    /** 返回一个新的单例 */
    static newinstance() {
        return new touchInstance();
    }

    private constructor() {
        this.canMove = false;
        cc.director.getCollisionManager().enabled = true;
        touchInstance.instance = this;
    }

    private canMove: boolean;

    // getCanMove(){
    //     return this.canMove;
    // }

    // setCanMove(flag:boolean){
    //     this.canMove = flag;
    //     if(!flag)
    //     {
    //         lib.msgEvent.getinstance().emit(lib.msgConfig.EndMove);
    //     }
    // }
}