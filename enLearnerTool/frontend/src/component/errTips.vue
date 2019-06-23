<template>
    <div class="mod_tips" v-show="errMsg?true:false">{{errMsg}}</div>
</template>

<script>
export default {
    name: 'ErrTips',
    data(){
        return {
            selfHandler: ''
        };
    },
    updated(){
        console.log('yes')
        if( this.errMsg ){
            let that = this;
            if (this.selfHandler) {
                clearTimeout(this.selfHandler);
            }
            this.selfHandler = setTimeout(()=>{
                that.$emit('hideTips');
            }, 3000);
        }
    },
    props:['errMsg']
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mod_tips{
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 999;
    min-width: 50%;
    padding: 15px 20px;
    border-radius: 3px;
    -webkit-border-radius: 3px;
    -webkit-box-shadow: 0 0 2px rgba(0,0,0,.2);
    transform: translate(-50%,-50%);
    -webkit-transform: translate(-50%,-50%);
    background-color: rgba(0,0,0,.8);
    box-shadow: 0 0 2px rgba(0,0,0,.2);
    font-size: 1.6rem;
    color: #fff;
    text-align: center;
    word-break: break-word;
    white-space:normal;
}
</style>
