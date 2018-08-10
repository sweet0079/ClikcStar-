import * as lib from '../lib/lib'
import { random } from '../lib/mod/litools';

const {ccclass, property} = cc._decorator;

@ccclass
export default class BackGroundControl extends cc.Component {

    @property(cc.Animation) meteor1: cc.Animation = null;
    @property(cc.Animation) meteor2: cc.Animation = null;
    // onLoad () {}

    start () {
        this.meteor1.on('finished',()=>{
            this.meteor1.node.active = false;
        },this);
        this.meteor2.on('finished',()=>{
            this.meteor2.node.active = false;
        },this);

        this.schedule(()=>{
            this.showMeteor();
        },2)
    }

    onDestroy(){
        this.meteor1.getComponent(cc.Animation).off('finished',()=>{
            this.meteor1.node.active = false;
        },this);
        this.meteor2.getComponent(cc.Animation).off('finished',()=>{
            this.meteor2.node.active = false;
        },this);
    }
    // update (dt) {

    // }
    private showMeteor(){
        let temp = lib.RandomParameters.RandomParameters.getRandomInt(100);
        if(temp < 30)
        {
            this.meteor1.node.active = true;
            this.meteor1.getClips()[0].speed = cc.random0To1() * 0.2 + 0.9;
            this.meteor1.play();
        }
        temp = lib.RandomParameters.RandomParameters.getRandomInt(100);
        if(temp < 30)
        {
            this.meteor2.node.active = true;
            this.meteor2.getClips()[0].speed = cc.random0To1() * 0.2 + 0.9;
            this.meteor2.play();
        }
    }
}
