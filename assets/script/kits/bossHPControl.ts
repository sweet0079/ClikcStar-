/** boss血量控制 */
import * as lib from '../lib/lib'
import HPBarControl from './HPBarControl';

const {ccclass, property} = cc._decorator;

@ccclass
export default class bossHPControl extends cc.Component {

    @property(cc.Prefab) hpNode: cc.Prefab = null;

    setHp(num:number){
        for(let i = 0; i < num; i++)
        {
            let hp = cc.instantiate(this.hpNode);
            this.node.addChild(hp);
        }
        for(let i = 0; i < this.node.children.length; i++)
        {
            this.node.children[i].name = (i + 1).toString();
            let angle = i * -(360 / num) * (2 * Math.PI / 360);
            this.node.children[i].x = 120 * Math.sin(angle);
            this.node.children[i].y = 120 * Math.cos(angle);
            this.node.children[i].scale = 0.4;
            this.node.children[i].rotation = i * 10;
        }
    }
}
