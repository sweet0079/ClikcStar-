/** 控制特殊图形随机旋转 */
import * as lib from '../lib/lib'

const {ccclass, property} = cc._decorator;

@ccclass
export default class randomRotate extends cc.Component {

    @property(cc.Boolean) Left: Boolean = false;

    private rotateNum: number = 0;
    private zheng: Boolean = true;

    start () {
        this.schedule(this.rot,1);
    }

    stopRot(){
        this.unschedule(this.rot);
    }

    private rot(){
        if(this.zheng)
        {
            this.randomRot1();
            this.zheng = false;
        }
        else
        {
            this.randomRot2();
            this.zheng = true;
        }
    }

    private randomRot1(){
        this.rotateNum = lib.RandomParameters.RandomParameters.getRandomInt(-180,-90);
        if(this.Left)
        {
            this.rotateNum = -this.rotateNum;
        }
        let act1 = cc.rotateBy(1,this.rotateNum);
        this.node.runAction(act1);
    }

    private randomRot2(){
        this.rotateNum = lib.RandomParameters.RandomParameters.getRandomInt(180,90);
        if(this.Left)
        {
            this.rotateNum = -this.rotateNum;
        }
        let act1 = cc.rotateBy(1,this.rotateNum);
        this.node.runAction(act1);
    }
}
