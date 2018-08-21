/** 用于控制形状的特性 */
import * as lib from '../lib/lib'
import FlyingShape from './FlyingShape'
import characteristic from './Characteristic'
import ShapeManager from './ShapeManager'
import randomRotate from './randomRotate'
import dispationControl from './Disspation'
import { _kits } from '../../../libdts/kits';

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShapeControl extends cc.Component {
    //----- 编辑器属性 -----//
    /** 默认形状 */
    @property({tooltip:"形状",  type: lib.defConfig.shape }) type = lib.defConfig.shape.triangle;
    /** 是否是特殊 */
    @property({tooltip:"是否是特殊",  type: cc.Boolean }) isSpecial:boolean = false;
    /** 外形素材数组 */
    @property({tooltip:"外形素材数组", type: [cc.SpriteFrame] }) SpriteFrameArr:Array<cc.SpriteFrame> = [];
    

    //----- 属性声明 -----//
    //消散控制器
    private dissControl: dispationControl = null;
    //飞行轨迹控制器
    private flyControl: FlyingShape = null;
    //已滞留时间
    private haveDetained: number = 0;
    //颜色
    private color: number = 0;
    //----- 生命周期 -----//

    // onLoad () {}

    start () {
        this.flyControl = this.node.getComponent(FlyingShape);
        this.dissControl = this.node.getComponent(dispationControl);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.ReStart,"reStart",this);
        lib.msgEvent.getinstance().addEvent(lib.msgConfig.Bomb,"bombCallBack",this);
        //this.setShape(2);
        this.schedule(()=>{
            if(this.isSpecial)
            {
                return;
            }
            if(ShapeManager.getinstance().getbig())
            {
                this.node.scale = 2;
            }
            else if(ShapeManager.getinstance().getsmall())
            {
                this.node.scale = 1;
            }
            else
            {
                this.node.scale = 1.5;
            }
        },0.5);
    }

    // update (dt) {}

    onDestroy(){
        ShapeManager.getinstance().delShape(this.node);
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.ReStart,"reStart",this);
        lib.msgEvent.getinstance().removeEvent(lib.msgConfig.Bomb,"bombCallBack",this);
    }
    //----- 公有方法 -----//
    //播放点击爆裂动画
    destroyAni(center:boolean = true){
        this.stopMoveAndAct();
        if(this.isSpecial)
        {
            if(this.type == 0)
            {
                lib.msgEvent.getinstance().emit(lib.msgConfig.addHP);
            }
            else if(this.type == 1)
            {
                lib.msgEvent.getinstance().emit(lib.msgConfig.Bomb);
                lib.msgEvent.getinstance().emit(lib.msgConfig.micBomb);
            }
        }
        this.flyControl.ShowNode.getComponent(cc.Animation).once('finished',()=>{
            this.node.destroy();
        },this);
        let temp = lib.RandomParameters.RandomParameters.getRandomInt(lib.defConfig.DissAniNum);
        if(this.isSpecial)
        {
            this.flyControl.ShowNode.rotation = 0;
            if(this.flyControl.ShowNode.getComponent(randomRotate))
            {
                this.flyControl.ShowNode.getComponent(randomRotate).stopRot();
            }
            temp = this.type;
            let round = this.node.getChildByName("round");
            round.active = false;
        }
        let Clip = this.flyControl.ShowNode.getComponent(cc.Animation).getClips()[temp];
        // if(this.isSpecial && this.type == 0)
        // {
        //     let act = cc.moveTo(Clip.duration * Clip.speed,-263,810);
        //     this.node.runAction(act);
        // }
        if(this.isSpecial)
        {
            this.flyControl.ShowNode.getComponent(cc.Animation).play(Clip.name);
        }
        else
        {
            let act;
            if(center)
            {
                let act1 = cc.scaleBy(0.1,2);
                let act2 = cc.scaleBy(0.1,0.5);
                this.flyControl.ShowNode.getChildByName("star").runAction(act1);
                act = act2;
            }
            else
            {
                let act1 = cc.scaleBy(0.1,1.5);
                let act2 = cc.scaleBy(0.1,0.1);
                this.flyControl.ShowNode.getChildByName("star").runAction(act2);
                act = act1;
            }
            let seq = cc.sequence(act,cc.callFunc(()=>{
                this.flyControl.ShowNode.scale = 0.6;
                this.flyControl.ShowNode.getComponent(cc.Animation).play(Clip.name);
            }));
            this.flyControl.ShowNode.runAction(seq);
        }
    }

    //随机颜色
    randomcolor(){
        let temp = parseInt((cc.random0To1() * lib.defConfig.ColorNum).toString());
        this.color = temp;
    }

    //设置为指定颜色
    setcolor(num:number){
        this.color = num;
    }

    //获取形状颜色和外形
    gettype(){
        return [this.type,this.color];
    }

    //获取形状颜色和外形
    randomShape(){
        let temp = parseInt((cc.random0To1() * (lib.defConfig.shape.length)).toString());
        this.type = temp;
        this.setShape(this.type);
    }

    //设置形状外形，此方法写在设置颜色之后
    setShape(type:number){
        this.flyControl = this.node.getComponent(FlyingShape);
        let calNode = this.flyControl.ShowNode;
        if(this.isSpecial)
        {
            this.type = type % 2;
            this.color = this.type;//播放破碎动画是根据color属性
            calNode.getComponent(cc.Sprite).spriteFrame = this.SpriteFrameArr[this.type];
            if(this.type == 1)
            {
                this.flyControl.ShowNode.getComponent(cc.Animation).play(this.flyControl.ShowNode.getComponent(cc.Animation).getClips()[2].name);
            }
        }
        else
        {
            this.type = type;
            calNode.getComponent(cc.Sprite).spriteFrame = this.SpriteFrameArr[this.type * lib.defConfig.ColorNum + this.color];
            //根据不同形状赋予不同的点击判定方法
            if(this.type == lib.defConfig.shape.triangle)
            {
                // this.setClickJudgeFun((x,y) => {
                //     return this._trianglegetIsClickShape(x,y);
                // });
                // this.setClickJudgeFun(this._trianglegetIsClickShape);
                calNode.children[0].setPositionY(-20);
            }
            // else if(this.type == lib.defConfig.shape.diamond)
            // {
            //     this.setClickJudgeFun(this._diamondgetIsClickShape);
            // }
            else if(this.type == lib.defConfig.shape.circular)
            {
                // this.setClickJudgeFun((x,y) => {
                //     return this._circulargetIsClickShape(x,y);
                // });
                this.setClickJudgeFun(this._circulargetIsClickShape);
                calNode.children[0].setPositionY(0);
            }
            else
            {
                calNode.children[0].setPositionY(0);
            }
        }
    }

    // 设置点击判断方法
    setClickJudgeFun(func: (x:number,y:number) => boolean) {
        this._IsClickShape = func;
    }
    // 重置点击判断方法
    resetClickJudgeFun() {
        this._IsClickShape = (x:number,y:number) => {
            return this._IsClickShape(x,y);
        }
    }
    //获取点击是否在形状内
    getIsClickShape(x:number,y:number){
        return this._IsClickShape(x,y);
    }
    
    //----- 事件回调 -----//
    //点击炸弹事件回调
    bombCallBack(delayTime = 0){
        if(this.type == 1 && this.isSpecial)
        {
            this._destroyAni();
            return;
        }
        let score: number = 50;
        if(this.isSpecial || !this.dissControl.getAdmission())
        {
            score = 0;
        }
        let shapInfo:_kits.ClickShape.ScoreInfo = {
            score: score,
            shape: this.gettype()[0],
            isSpecial: this.isSpecial,
        }
        this.scheduleOnce(()=>{
            lib.msgEvent.getinstance().emit(lib.msgConfig.clickStart,shapInfo);
            // ShapeManager.getinstance().delShape(this.node);
            lib.msgEvent.getinstance().emit(lib.msgConfig.Settlement);
            lib.msgEvent.getinstance().emit(lib.msgConfig.ShowScore,cc.v2(this.node.getPositionX(),this.node.getPositionY()));
            this._destroyAni();
        },delayTime);
    }
    //重新开始事件回调
    private reStart(){
        this.node.destroy();
    }

    //----- 私有方法 -----//
    //私有的播放点击动画，不发送任何消息
    private _destroyAni(center = true){
        this.stopMoveAndAct();
        this.flyControl.ShowNode.getComponent(cc.Animation).once('finished',()=>{
            this.node.destroy();
        },this);
        let temp = lib.RandomParameters.RandomParameters.getRandomInt(lib.defConfig.DissAniNum);
        if(this.isSpecial)
        {
            this.flyControl.ShowNode.rotation = 0;
            if(this.flyControl.ShowNode.getComponent(randomRotate))
            {
                this.flyControl.ShowNode.getComponent(randomRotate).stopRot();
            }
            temp = this.type;
            let round = this.node.getChildByName("round");
            round.active = false;
        }
        let Clip = this.flyControl.ShowNode.getComponent(cc.Animation).getClips()[temp];
        if(this.isSpecial)
        {
            this.flyControl.ShowNode.getComponent(cc.Animation).play(Clip.name);
        }
        else
        {
            let act;
            let act1 = cc.scaleBy(0.1,1.5);
            let act2 = cc.scaleBy(0.1,0.5);
            if(center)
            {
                this.flyControl.ShowNode.getChildByName("star").runAction(act1);
                act = act2;
            }
            else
            {
                this.flyControl.ShowNode.getChildByName("star").runAction(act2);
                act = act1;
            }
            let seq = cc.sequence(act,cc.callFunc(()=>{
                this.flyControl.ShowNode.scale = 0.6;
                this.flyControl.ShowNode.getComponent(cc.Animation).play(Clip.name);
            }));
            this.flyControl.ShowNode.runAction(seq);
        }
    }
    //停止形状所有的移动和动作事件
    private stopMoveAndAct(){
        if(this.flyControl)
        {
            this.flyControl.stopMove();
        }
        this.node.getComponent(characteristic).stopAct();
    }

    private _IsClickShape(x:number,y:number){
        return this._DefauleIsClickShape(x,y);
    }

    private _DefauleIsClickShape(x:number,y:number){
        return true;
    }
    //判断三角形时点击是否落于三角形内
    private _trianglegetIsClickShape(x:number,y:number)
    {
        let calNode = this.flyControl.ShowNode;
        let temp: number = 0;
        let result: boolean = false;
        //计算旋转前的点击落点（点击落点在形状旋转前后始终在同一个圈上）
        let dis = Math.sqrt((x * x + y * y));
        let touAngle = Math.asin(y / dis);
        //如果是一个大于90度的角a，asin函数默认会返回180 - a
        if(x < 0)
        {
            touAngle = 180 * lib.defConfig.coefficient - touAngle;
        }
        let nowAngle = touAngle + this.node.rotation * lib.defConfig.coefficient; 
        let nowx = dis * Math.cos(nowAngle);
        let nowy = dis * Math.sin(nowAngle);
        if(nowx < 0){
            temp = calNode.height * Math.abs(calNode.scaleY) * Math.abs(this.node.scaleY) / calNode.width * Math.abs(calNode.scaleX) * Math.abs(this.node.scaleX) * nowx
                 + calNode.height * Math.abs(calNode.scaleY) * Math.abs(this.node.scaleY) / 2;
            if(nowy < temp + 15 * Math.abs(calNode.scaleY) * Math.abs(this.node.scaleY))
            {
                result = true;
            }
        }
        else
        {
            temp = -1 * calNode.height * Math.abs(calNode.scaleY) * Math.abs(this.node.scaleY) / calNode.width * Math.abs(calNode.scaleX) * Math.abs(this.node.scaleX) * nowx
                 + calNode.height * Math.abs(calNode.scaleY) * Math.abs(this.node.scaleY) / 2;
            if(nowy < temp + 15 * Math.abs(calNode.scaleY) * Math.abs(this.node.scaleY))
            {
                result = true;
            }
        }
        return result;
    }

    //判断圆形时点击是否落于圆形内
    private _circulargetIsClickShape(x:number,y:number){
        let calNode = this.flyControl.ShowNode;
        let dis = Math.sqrt((x * x + y * y));
        if(dis < calNode.width * Math.abs(calNode.scaleX) * this.node.scaleX / 2
        ||dis < calNode.height * Math.abs(calNode.scaleY) * this.node.scaleY / 2)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    //判断菱形时点击是否落于菱形内
    private _diamondgetIsClickShape(x:number,y:number){
        let calNode = this.flyControl.ShowNode;
        let temp: number = 0;
        let result: boolean = false;
        //计算旋转前的点击落点
        let dis = Math.sqrt((x * x + y * y));
        let touAngle = Math.asin(y / dis);
        if(x < 0)
        {
            touAngle = 180 * lib.defConfig.coefficient - touAngle;
        }
        let nowAngle = touAngle + this.node.rotation * lib.defConfig.coefficient; 
        let nowx = dis * Math.cos(nowAngle);
        let nowy = dis * Math.sin(nowAngle);
        if(nowx < 0 && nowy < 0)
        {
            temp = (-1 * calNode.height * Math.abs(calNode.scaleY) * this.node.scaleY / calNode.width * Math.abs(calNode.scaleX)) * nowx * this.node.scaleX
                 - calNode.height * Math.abs(calNode.scaleY) * this.node.scaleY / 2;
            if(nowy > temp - 15 * Math.abs(calNode.scaleY) * this.node.scaleY)
            {
                result = true;
            }
        }
        else if(nowx < 0 && nowy > 0)
        {
            temp = (calNode.height * Math.abs(calNode.scaleY) * this.node.scaleY / calNode.width * Math.abs(calNode.scaleX)) * nowx * this.node.scaleX
                 + calNode.height * Math.abs(calNode.scaleY) * this.node.scaleY / 2;
            if(nowy < temp + 15 * Math.abs(calNode.scaleY) * this.node.scaleY)
            {
                result = true;
            }
        }
        else if(nowx > 0 && nowy > 0)
        {
            temp = (-1 * calNode.height * Math.abs(calNode.scaleY) * this.node.scaleY / calNode.width * Math.abs(calNode.scaleX)) * nowx  * this.node.scaleX
                 + calNode.height * Math.abs(calNode.scaleY) * this.node.scaleY / 2;
            if(nowy < temp + 15 * Math.abs(calNode.scaleY) * this.node.scaleY)
            {
                result = true;
            }
        }
        else if(nowx > 0 && nowy < 0)
        {
            temp = (calNode.height * Math.abs(calNode.scaleY) * this.node.scaleY / calNode.width * Math.abs(calNode.scaleX)) * nowx * this.node.scaleX
                 - calNode.height * Math.abs(calNode.scaleY) * this.node.scaleY / 2;
            if(nowy > temp - 15 * Math.abs(calNode.scaleY) * this.node.scaleY)
            {
                result = true;
            }
        }
        else
        {
            result = true;
        }
        return result;
    }
}