/** 预制体语言控制 */

import * as lib from '../lib/lib'

const {ccclass, property} = cc._decorator;

@ccclass
export default class PFBLanguage extends cc.Component {

    //需要改变的Sprite节点
    @property(cc.Sprite) logo: cc.Sprite = null;
    @property(cc.SpriteFrame) logoCN: cc.SpriteFrame = null;
    @property(cc.SpriteFrame) logoEN: cc.SpriteFrame = null;

    start () {
        if(lib.lanConfig.nowLanguage == lib.lanConfig.Language.english)
        {
            this.setEnglish();
        }
        else if(lib.lanConfig.nowLanguage == lib.lanConfig.Language.chinese)
        {
            this.setChinese();
        }
    }

    setChinese(){
        this.logo.spriteFrame = this.logoCN;
    }

    setEnglish(){
        this.logo.spriteFrame = this.logoEN;
    }
}
