/** 血条控制 */
import * as lib from '../lib/lib'
import ColliderControl from './ColliderControl';
const {ccclass, property} = cc._decorator;

@ccclass
export default class HPBarControl extends cc.Component {

    //----- 编辑器属性 -----//
    //血条初始图片
    @property(cc.ProgressBar) HPPro: cc.ProgressBar = null;
    //----- 属性声明 -----//
    private hasPlay:boolean = false;
    //----- 生命周期 -----//
    start () {
        // for(let i = 0 ; i < this.node.childrenCount; i++)
        // {
        //     this.node.children[i].getComponent(cc.Animation).on('finished',()=>{
        //         this.node.children[i].active = false;
        //         if(this.HPPic)
        //         {
        //             this.node.children[i].getComponent(cc.Sprite).spriteFrame = this.HPPic;
        //         }
        //     },this);;
        // }
        this.initHPBar();
    }
    //----- 按钮回调 -----//
    //----- 事件回调 -----//
    //----- 公有方法 -----//
    initHPBar(){
        // for(let i = 0 ; i < this.node.childrenCount; i++)
        // {
        //     this.node.children[i].getComponent(cc.Animation).stop();
        //     this.node.children[i].getComponent(cc.Sprite).spriteFrame = this.HPPic;
        //     this.node.children[i].active = true;
        //     this.node.children[i].scale = 1;
        // }
        this.HPPro.progress = 1;
        this.stopblink();
    }

    //输入当前血量
    minHp(num){
        // this.node.children[num].getComponent(cc.Animation).play();
        // this.ReActiveHp(num);
        this.HPPro.progress = num / lib.defConfig.MAXHP;
        if(this.HPPro.progress < 0.17)
        {
            this.blink();
        }
    }

    //输入当前血量
    addHp(num){
        // this.node.children[num - 1].active = true;
        // this.node.children[num - 1].runAction(cc.scaleTo(0.2,1));
        // this.ReActiveHp(num - 1);
        this.HPPro.progress = num / lib.defConfig.MAXHP;
        if(this.HPPro.progress >= 0.17)
        {
            this.stopblink();
        }
    }
    //----- 私有方法 -----//
    private blink(){
        // let act = cc.blink(2,3);
        // this.node.runAction(act);
        if(this.hasPlay)
        {
            return;
        }
        this.HPPro.barSprite.node.getComponent(cc.Animation).play();
        this.hasPlay = true;
    }
    private stopblink(){
        if(!this.hasPlay)
        {
            return;
        }
        this.HPPro.barSprite.node.getComponent(cc.Animation).stop();
        this.HPPro.barSprite.node.color = cc.hexToColor("#00EDB2");
        this.hasPlay = false;
    }
}
