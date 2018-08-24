/** 主界面语言控制 */

import HelpLanguage from './Helplanguage'
import * as lib from '../lib/lib'

const {ccclass, property} = cc._decorator;

@ccclass
export default class StartSceneLanguage extends cc.Component {

    @property(cc.Sprite) logo: cc.Sprite = null;
    @property(cc.Sprite) startGame: cc.Sprite = null;
    @property(HelpLanguage) HelpLayer: HelpLanguage = null;
    @property(cc.SpriteFrame) logoCN: cc.SpriteFrame = null;
    @property(cc.SpriteFrame) logoEN: cc.SpriteFrame = null;
    @property(cc.SpriteFrame) startGameCN: cc.SpriteFrame = null;
    @property(cc.SpriteFrame) startGameEN: cc.SpriteFrame = null;
    @property(cc.SpriteFrame) startGameSelectCN: cc.SpriteFrame = null;
    @property(cc.SpriteFrame) startGameSelectEN: cc.SpriteFrame = null;

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
        this.startGame.spriteFrame = this.startGameCN;
        this.startGame.node.getComponent(cc.Button).normalSprite =  this.startGameCN;
        this.startGame.node.getComponent(cc.Button).hoverSprite =  this.startGameCN;
        this.startGame.node.getComponent(cc.Button).disabledSprite =  this.startGameCN;
        this.startGame.node.getComponent(cc.Button).pressedSprite =  this.startGameSelectCN;
        this.HelpLayer.setChinese();
    }

    setEnglish(){
        this.logo.spriteFrame = this.logoEN;
        this.startGame.spriteFrame = this.startGameEN;
        this.startGame.node.getComponent(cc.Button).normalSprite =  this.startGameEN;
        this.startGame.node.getComponent(cc.Button).hoverSprite =  this.startGameEN;
        this.startGame.node.getComponent(cc.Button).disabledSprite =  this.startGameEN;
        this.startGame.node.getComponent(cc.Button).pressedSprite =  this.startGameSelectEN;
        this.HelpLayer.setEnglish();
    }
}
