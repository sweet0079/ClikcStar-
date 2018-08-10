/** 用于控制形状的消散 */
import * as lib from '../lib/lib'
import FlyingShape from './FlyingShape'
import shapeControl from './ShapeControl'
import ShapeManager from './ShapeManager'

const {ccclass, property} = cc._decorator;

@ccclass
export default class Dissipation extends cc.Component {
    //----- 编辑器属性 -----//
    /** 默认消散类型 */
    @property({tooltip:"消散类型",  type: lib.defConfig.dissipate }) type = lib.defConfig.dissipate.none;
    /** 反弹上限次数 */
    @property({tooltip:"反弹上限次数",  type: cc.Integer }) ReboundLimit: number = 4;
    /** 融入上限次数 */
    @property({tooltip:"融入上限次数",  type: cc.Integer }) IntegrationLimit: number = 3;
    /** 默认最小消散距离 */
    @property({tooltip:"最小消散距离",  type: cc.Integer }) MiniDissDistance: number = 500;
    //----- 属性声明 -----//
    //飞行轨迹控制器
    private flyControl: FlyingShape = null;
    //是否进入屏幕
    private haveAdmission: boolean = false;
    //是否离开屏幕
    private haveLeave: boolean = false;
    //刚刚触发过反弹的标识符（防止物体在放大时，正好进入触发反弹判断，当物体放大速度大于物体远离边界速度，会再次触发反弹）
    private reboundFlag: boolean = false;
    //上次反弹触碰的边界
    private lastRebound: number = lib.defConfig.lastReboundPos.bottom;
    //已经反弹次数
    private ReboundTime: number = 0;
 
    //----- 生命周期 -----//

    // onLoad () {}

    start () {
        this.flyControl = this.node.getComponent(FlyingShape);
    }

    update (dt) {
        //因为某些原因遗漏的形状删除
        if(this.node.position.x > lib.defConfig.DesignPlayWidth 
        || this.node.position.x < -lib.defConfig.DesignPlayWidth
        || this.node.position.y > lib.defConfig.DesignPlayHeight
        || this.node.position.y < -lib.defConfig.DesignPlayHeight) 
        {
            ShapeManager.getinstance().delShape(this.node);
            this.node.destroy();
        }
        //离开屏幕后进行销毁判断
        if(this.haveLeave)
        {
            if(this.node.position.x >= lib.defConfig.DesignPlayWidth/2 + this.flyControl.ShowNode.width/2 * this.node.scaleX * this.flyControl.ShowNode.scaleX - this.flyControl.Speed * dt
            || this.node.position.x <= -lib.defConfig.DesignPlayWidth/2 - this.flyControl.ShowNode.width/2 * this.node.scaleX * this.flyControl.ShowNode.scaleX + this.flyControl.Speed * dt
            || this.node.position.y >= lib.defConfig.DesignPlayHeight/2 + this.flyControl.ShowNode.height/2 * this.node.scaleY * this.flyControl.ShowNode.scaleY - this.flyControl.Speed * dt
            || this.node.position.y <= -lib.defConfig.DesignPlayHeight/2 - this.flyControl.ShowNode.height/2 * this.node.scaleY * this.flyControl.ShowNode.scaleY + this.flyControl.Speed * dt)
            {
                if(this.type == lib.defConfig.dissipate.integration
                && this.IntegrationLimit != 0)
                {
                    return;
                }
                ShapeManager.getinstance().delShape(this.node);
                this.node.destroy();
            }
            return;
        }
        //判断是否进入屏幕
        if(!this.haveAdmission)
        {
            if(this.node.position.x <= lib.defConfig.DesignPlayWidth/2 - this.flyControl.ShowNode.width/2 * this.node.scaleX * this.flyControl.ShowNode.scaleX
            && this.node.position.x >= -lib.defConfig.DesignPlayWidth/2 + this.flyControl.ShowNode.width/2 * this.node.scaleX * this.flyControl.ShowNode.scaleX
            && this.node.position.y <= lib.defConfig.DesignPlayHeight/2 - this.flyControl.ShowNode.height/2 * this.node.scaleY * this.flyControl.ShowNode.scaleY
            && this.node.position.y >= -lib.defConfig.DesignPlayHeight/2 + this.flyControl.ShowNode.height/2 * this.node.scaleY * this.flyControl.ShowNode.scaleY)
            {
                this.haveAdmission = true;
            } 
        }
        //判断是否接触到屏幕边界
        else
        {
            // if(this.node.position.x >= lib.defConfig.DesignPlayWidth/2 - this.node.width/2 * this.node.scaleX + this.flyControl.Speed * dt
            // || this.node.position.x <= -lib.defConfig.DesignPlayWidth/2 + this.node.width/2 * this.node.scaleX - this.flyControl.Speed * dt
            // || this.node.position.y >= lib.defConfig.DesignPlayHeight/2 - this.node.height/2 * this.node.scaleY + this.flyControl.Speed * dt
            // || this.node.position.y <= -lib.defConfig.DesignPlayHeight/2 + this.node.height/2 * this.node.scaleY - this.flyControl.Speed * dt)
            if(this.node.position.x >= lib.defConfig.DesignPlayWidth/2 - this.flyControl.ShowNode.width/2 * this.node.scaleX * this.flyControl.ShowNode.scaleX
            || this.node.position.x <= -lib.defConfig.DesignPlayWidth/2 + this.flyControl.ShowNode.width/2 * this.node.scaleX * this.flyControl.ShowNode.scaleX
            || this.node.position.y >= lib.defConfig.DesignPlayHeight/2 - this.flyControl.ShowNode.height/2 * this.node.scaleY * this.flyControl.ShowNode.scaleY
            || this.node.position.y <= -lib.defConfig.DesignPlayHeight/2 + this.flyControl.ShowNode.height/2 * this.node.scaleY * this.flyControl.ShowNode.scaleY)
            {
                if(this.flyControl.getsubMoveDis() < this.MiniDissDistance)
                {
                    this.rebounds(true);
                }
                else
                {
                    this.haveLeave = true;
                    this._destfun();
                    // this.integration();
                }
            }
        }
        //判断反弹后是否离开边界
        //根据上次碰撞位置做判断
        if(this.reboundFlag)
        {
            switch(this.lastRebound)
            {
                //四个角落
                case lib.defConfig.lastReboundPos.other:
                    if(this.node.position.x <= lib.defConfig.DesignPlayWidth/2 - this.flyControl.ShowNode.width/2 * this.node.scaleX * this.flyControl.ShowNode.scaleX
                    && this.node.position.x >= -lib.defConfig.DesignPlayWidth/2 + this.flyControl.ShowNode.width/2 * this.node.scaleX * this.flyControl.ShowNode.scaleX
                    && this.node.position.y <= lib.defConfig.DesignPlayHeight/2 - this.flyControl.ShowNode.height/2 * this.node.scaleY * this.flyControl.ShowNode.scaleY
                    && this.node.position.y >= -lib.defConfig.DesignPlayHeight/2 + this.flyControl.ShowNode.height/2 * this.node.scaleY * this.flyControl.ShowNode.scaleY)
                    {
                        this.reboundFlag = false;
                    } 
                    break;
                //上
                case lib.defConfig.lastReboundPos.top:
                    if(this.node.position.y <= lib.defConfig.DesignPlayHeight/2 - this.flyControl.ShowNode.height/2 * this.node.scaleY * this.flyControl.ShowNode.scaleY)
                    {
                        this.reboundFlag = false;
                    } 
                    break;
                //下
                case lib.defConfig.lastReboundPos.bottom:
                    if(this.node.position.y >= -lib.defConfig.DesignPlayHeight/2 + this.flyControl.ShowNode.height/2 * this.node.scaleY * this.flyControl.ShowNode.scaleY)
                    {
                        this.reboundFlag = false;
                    } 
                    break;
                //左
                case lib.defConfig.lastReboundPos.left:
                    if(this.node.position.x >= -lib.defConfig.DesignPlayWidth/2 + this.flyControl.ShowNode.width/2 * this.node.scaleX * this.flyControl.ShowNode.scaleX)
                    {
                        this.reboundFlag = false;
                    } 
                    break;
                //右
                case lib.defConfig.lastReboundPos.right:
                    if(this.node.position.x <= lib.defConfig.DesignPlayWidth/2 - this.flyControl.ShowNode.width/2 * this.node.scaleX * this.flyControl.ShowNode.scaleX)
                    {
                        this.reboundFlag = false;
                    } 
                    break;
                default:
                    break;
            }
        }
    }
    //----- 公有方法 -----//
    //获取是否进入屏幕
    getAdmission(){
        return this.haveAdmission;
    }
    //执行消散方法
    destroyAni(){
        this._destfun();
    }
    //获取是否已经消散
    getLeave(){
        return this.haveLeave;
    }
    //取得所有消散参数
    getparameter(){
        let disspationparameter: _kits.Disspation.parameters = {
            type: this.type,
        }
        return disspationparameter;
    }

    //设置所有消散参数
    setparameter(parameter: _kits.Disspation.parameters){
        this.type = parameter.type;
    }
    //----- 私有方法 -----//
    private _destfun(){
        switch(this.type)
        {
            case lib.defConfig.dissipate.none:
                break;
            case lib.defConfig.dissipate.fragmentation:
                break;
            case lib.defConfig.dissipate.integration:
                this.integration();
                break;
            case lib.defConfig.dissipate.disappear:
                break;
            case lib.defConfig.dissipate.drop:
                this.dropdes();
                break;
            case lib.defConfig.dissipate.sticky:
                this.stickies();
                break;
            case lib.defConfig.dissipate.rebound:
                this.rebounds();
                //this.node.getComponent(shapeControl).start();
                break;
            case lib.defConfig.dissipate.decompose:
                break;
            default:
                break;
        }
    }

    // private setdestroy(fun:_li.cb.norCallBack) {
    //     this._destfun = fun;
    // }

    // 融入
    private integration(){
        if(this.IntegrationLimit == 0)
        {
            return;
        }
        this.haveLeave = false;
        if(this.node.position.x >= lib.defConfig.DesignPlayWidth/2 + this.flyControl.ShowNode.width/2 * this.node.scaleX * this.flyControl.ShowNode.scaleX)
        {
            this.node.x *= -1;
            this.IntegrationLimit--;
            this.haveAdmission = false;
        }
        else if(this.node.position.x <= -lib.defConfig.DesignPlayWidth/2 - this.flyControl.ShowNode.width/2 * this.node.scaleX * this.flyControl.ShowNode.scaleX)
        {
            this.node.x *= -1;
            this.IntegrationLimit--;
            this.haveAdmission = false;
        }
        else if(this.node.position.y >= lib.defConfig.DesignPlayHeight/2 + this.flyControl.ShowNode.height/2 * this.node.scaleY * this.flyControl.ShowNode.scaleY)
        {
            this.node.y *= -1;
            this.IntegrationLimit--;
            this.haveAdmission = false;
        }
        else if(this.node.position.y <= -lib.defConfig.DesignPlayHeight/2 - this.flyControl.ShowNode.height/2 * this.node.scaleY * this.flyControl.ShowNode.scaleY)
        {
            this.node.y *= -1;
            this.IntegrationLimit--;
            this.haveAdmission = false;
        }
    }

    private dropdes(){
        //this.flyControl.drop();
        //this.type = lib.defConfig.dissipate.none;
    }

    private stickies(){
        this.flyControl.Speed *= 0.1;
    }

    //参数强行控制可以连续反弹，用于没有飞行到最小距离就出边的情况
    private rebounds(once:boolean = false){
        if(this.reboundFlag)
        {
            //判断是否可以连续反弹
            if(this.ReboundTime < this.ReboundLimit)
            {
                this.haveLeave = false;
            }
            return;
        }
        //右边反弹
        if(this.node.position.x >= lib.defConfig.DesignPlayWidth/2 - this.flyControl.ShowNode.width/2 * this.node.scaleX * this.flyControl.ShowNode.scaleX)
        {
            //右下角反弹
            if(this.node.position.y <= -lib.defConfig.DesignPlayHeight/2 + this.flyControl.ShowNode.height/2 * this.node.scaleY * this.flyControl.ShowNode.scaleY)
            {
                this.lastRebound = lib.defConfig.lastReboundPos.other;
                this.flyControl.setAngle(180 + this.flyControl.Angle);
            }
            //右上角反弹
            else if(this.node.position.y >= lib.defConfig.DesignPlayHeight/2 - this.flyControl.ShowNode.height/2 * this.node.scaleY * this.flyControl.ShowNode.scaleY)
            {
                this.lastRebound = lib.defConfig.lastReboundPos.other;
                this.flyControl.setAngle(180 + this.flyControl.Angle);
            }
            else
            {
                this.lastRebound = lib.defConfig.lastReboundPos.right;
                this.flyControl.setAngle(180 - this.flyControl.Angle);
            }
        }
        //左边反弹
        else if(this.node.position.x <= -lib.defConfig.DesignPlayWidth/2 + this.flyControl.ShowNode.width/2 * this.node.scaleX * this.flyControl.ShowNode.scaleX)
        {
            //左下角反弹
            if(this.node.position.y <= -lib.defConfig.DesignPlayHeight/2 + this.flyControl.ShowNode.height/2 * this.node.scaleY * this.flyControl.ShowNode.scaleY)
            {
                this.lastRebound = lib.defConfig.lastReboundPos.other;
                this.flyControl.setAngle(180 + this.flyControl.Angle);
            }
            //左上角反弹
            else if(this.node.position.y >= lib.defConfig.DesignPlayHeight/2 - this.flyControl.ShowNode.height/2 * this.node.scaleY * this.flyControl.ShowNode.scaleY)
            {
                this.lastRebound = lib.defConfig.lastReboundPos.other;
                this.flyControl.setAngle(180 + this.flyControl.Angle);
            }
            else
            {
                this.lastRebound = lib.defConfig.lastReboundPos.left;
                this.flyControl.setAngle(180 - this.flyControl.Angle);
            }
        }
        //上边反弹
        else if(this.node.position.y >= lib.defConfig.DesignPlayHeight/2 - this.flyControl.ShowNode.height/2 * this.node.scaleY * this.flyControl.ShowNode.scaleY)
        {
            //右上角反弹
            if(this.node.position.x >= lib.defConfig.DesignPlayWidth/2 - this.flyControl.ShowNode.width/2 * this.node.scaleX * this.flyControl.ShowNode.scaleX)
            {
                this.lastRebound = lib.defConfig.lastReboundPos.other;
                this.flyControl.setAngle(180 + this.flyControl.Angle);
            }
            //左上角反弹
            else if(this.node.position.x <= -lib.defConfig.DesignPlayWidth/2 + this.flyControl.ShowNode.width/2 * this.node.scaleX * this.flyControl.ShowNode.scaleX)
            {
                this.lastRebound = lib.defConfig.lastReboundPos.other;
                this.flyControl.setAngle(180 + this.flyControl.Angle);
            }
            else
            {
                this.lastRebound = lib.defConfig.lastReboundPos.top;
                this.flyControl.setAngle(-this.flyControl.Angle);
            }
        }
        //下边反弹
        else if(this.node.position.y <= -lib.defConfig.DesignPlayHeight/2 + this.flyControl.ShowNode.height/2 * this.node.scaleY * this.flyControl.ShowNode.scaleY)
        {
            //右下角反弹
            if(this.node.position.x >= lib.defConfig.DesignPlayWidth/2 - this.flyControl.ShowNode.width/2 * this.node.scaleX * this.flyControl.ShowNode.scaleX)
            {
                this.lastRebound = lib.defConfig.lastReboundPos.other;
                this.flyControl.setAngle(180 + this.flyControl.Angle);
            }
            //左下角反弹
            else if(this.node.position.x <= -lib.defConfig.DesignPlayWidth/2 + this.flyControl.ShowNode.width/2 * this.node.scaleX * this.flyControl.ShowNode.scaleX)
            {
                this.lastRebound = lib.defConfig.lastReboundPos.other;
                this.flyControl.setAngle(180 + this.flyControl.Angle);
            }
            else
            {
                this.lastRebound = lib.defConfig.lastReboundPos.bottom;
                this.flyControl.setAngle(-this.flyControl.Angle);
            }
        }
        this.reboundFlag = true;
        //判断是否可以连续反弹
        if(this.ReboundTime < this.ReboundLimit)
        {
            this.haveLeave = false;
        }
        if(!once)
        {
            this.ReboundTime++;
        }
    }
}
