/** 挂在形状的背景节点，用于监听触摸结束 */
import * as lib from '../lib/lib'
import UIControl from './UIControl'

const {ccclass, property} = cc._decorator;

@ccclass
export default class ClickEnd extends cc.Component {
    //----- 编辑器属性 -----//
    //点击的波纹预制体
    @property(cc.Prefab) clickPre: cc.Prefab = null;
    //UI控制组件
    @property(UIControl) UIcon: UIControl = null;
    // //touchPoint预制体
    // @property(cc.Prefab) touchPointPfb: cc.Prefab = null;
    //----- 属性声明 -----//
    //点击开始时间戳
    private time:number = 0;
    // private _touchInstance:touchInstance = null;
    // //开始滑动
    // private startMove:boolean = false;
    // //活动碰撞点
    // private touchPoint: cc.Node = null;
    //----- 生命周期 -----//

    onLoad () {
        // lib.msgEvent.getinstance().addEvent(lib.msgConfig.EndMove,"_endMove",this);
        // this._touchInstance = touchInstance.getinstance();
        this.node.on(cc.Node.EventType.TOUCH_START,(event:cc.Event.EventTouch)=>{
            this._clickStart(event);
        },this);
        // this.node.on(cc.Node.EventType.TOUCH_MOVE,(event:cc.Event.EventTouch)=>{
        //     this._clickMove(event);
        // },this);
        // this.node.on(cc.Node.EventType.TOUCH_END,(event:cc.Event.EventTouch)=>{
        //     this._clickEnd();
        // },this);

        // this.node.on(cc.Node.EventType.TOUCH_CANCEL,(event:cc.Event.EventTouch)=>{
        //     this._clickEnd();
        // },this);
    }

    // start () {

    // }

    // update (dt) {}

    onDestroy(){
    }
    
    //----- 私有方法 -----//
    // private _clickEnd(){
    // }
    // private _endMove(){
    //     if(this.touchPoint)
    //     {
    //         this.touchPoint.destroy();
    //         this.touchPoint = null;
    //     }
    //     this.startMove = false;
    // }

    private _clickStart(event:cc.Event.EventTouch){
        let touchx = event.getLocation().x - this.node.convertToWorldSpaceAR(cc.Vec2.ZERO).x;
        let touchy = event.getLocation().y - this.node.convertToWorldSpaceAR(cc.Vec2.ZERO).y;
        // if(this._touchInstance.getCanMove())
        // {
        //     if(this.startMove)
        //     {
        //         return;
        //     }
        //     this.startMove = true;
        //     this.touchPoint = cc.instantiate(this.touchPointPfb);
        //     this.touchPoint.setPosition(touchx,touchy);
        //     this.touchPoint.parent = this.node.parent;
        // }
        // else
        // {
            lib.msgEvent.getinstance().emit(lib.msgConfig.SetSXFlag);
            lib.msgEvent.getinstance().emit(lib.msgConfig.Settlement);
            let clickAni = cc.instantiate(this.clickPre);
            clickAni.getComponent(cc.Animation).once('finished',()=>{
                clickAni.destroy();
            },this);
            clickAni.getComponent(cc.Animation).play();
            clickAni.setPosition(touchx,touchy);
            this.node.parent.addChild(clickAni);
            lib.msgEvent.getinstance().emit(lib.msgConfig.ShowScore,cc.v2(touchx,touchy));
        // }
    }

    // private _clickMove(event:cc.Event.EventTouch){
    //     if(this._touchInstance.getCanMove())
    //     {
    //         this.touchPoint.x += event.getDeltaX();
    //         this.touchPoint.y += event.getDeltaY();
    //     }
    //     else
    //     {
    //         let deltDis = Math.sqrt(Math.pow(event.getDeltaX(),2) + Math.pow(event.getDeltaY(),2));
    //         if(deltDis < 50)
    //         {
    //             console.log("小于50");
    //             return;
    //         }
    //         if(this.UIcon.getPowerIsFull())
    //         {
    //             this.UIcon.checkMove();
    //             if(this.startMove)
    //             {
    //                 return;
    //             }
    //             let touchx = event.getLocation().x - this.node.convertToWorldSpaceAR(cc.Vec2.ZERO).x;
    //             let touchy = event.getLocation().y - this.node.convertToWorldSpaceAR(cc.Vec2.ZERO).y;
    //             this.startMove = true;
    //             this.touchPoint = cc.instantiate(this.touchPointPfb);
    //             this.touchPoint.setPosition(touchx,touchy);
    //             this.touchPoint.parent = this.node.parent;
    //         }
    //     }
    // }

    // private _clickEnd(){
    //     if(this._touchInstance.getCanMove())
    //     {
    //         this.touchPoint.destroy();
    //         this.touchPoint = null;
    //         this.startMove = false;
    //     }
    // }
}
