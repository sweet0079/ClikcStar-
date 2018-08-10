/** 血条控制 */
import * as lib from '../lib/lib'
const {ccclass, property} = cc._decorator;

@ccclass
export default class HPBarControl extends cc.Component {

    //----- 编辑器属性 -----//
    //血条初始图片
    @property(cc.SpriteFrame) HPPic: cc.SpriteFrame = null;
    //----- 属性声明 -----//
    //----- 生命周期 -----//
    start () {
        for(let i = 0 ; i < this.node.childrenCount; i++)
        {
            this.node.children[i].getComponent(cc.Animation).on('finished',()=>{
                this.node.children[i].active = false;
                if(this.HPPic)
                {
                    this.node.children[i].getComponent(cc.Sprite).spriteFrame = this.HPPic;
                }
            },this);;
        }
    }
    //----- 按钮回调 -----//
    //----- 事件回调 -----//
    //----- 公有方法 -----//
    blink(){
        let act = cc.blink(2,3);
        this.node.runAction(act);
    }
    initHPBar(){
        for(let i = 0 ; i < this.node.childrenCount; i++)
        {
            this.node.children[i].getComponent(cc.Animation).stop();
            this.node.children[i].getComponent(cc.Sprite).spriteFrame = this.HPPic;
            this.node.children[i].active = true;
            this.node.children[i].scale = 1;
        }
    }

    //输入当前血量
    minHp(num){
        this.node.children[num].getComponent(cc.Animation).play();
        this.ReActiveHp(num);
    }

    //输入当前血量
    addHp(num){
        this.node.children[num - 1].active = true;
        this.node.children[num - 1].runAction(cc.scaleTo(0.2,1));
        this.ReActiveHp(num - 1);
    }
    //----- 私有方法 -----//
    private ReActiveHp(num){
        for(let i = 0; i < num; i++)
        {
            this.node.children[i].active = true;
        }
        for(let i = num + 1; i < this.node.childrenCount; i++)
        {
            this.node.children[i].active = false;
        }
    }
}
