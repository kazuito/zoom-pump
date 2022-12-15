const IMG_STYLE = `
<style>
body{
  margin:0;
  padding: 0;
  background-color: #0e0e0e !important;
  height:100%;
  font-family: "Roboto", sans-serif;
}
#t, #di{
  position: absolute;
  cursor: pointer;
  opacity: 0;
}
@keyframes hide-img{
  from{
    right: 0px;
    opacity: .5;
  }
  to{
    right: -50px;
    opacity: 0;
  }
}
.di-box{
  z-index: 101;
  position: fixed;
  top: 10px;
  right: 0;
  width: 140px;
  height: 140px;
  border-radius: 8px 0 0 8px;
  transition: .1s;
  animation: hide-img .2s forwards;
  overflow: hidden;
  cursor: pointer;
}
@keyframes show-img{
  from{
    right: -50px;
    opacity: 0;
  }
  to{
    right: 0px;
    opacity: .7;
  }
}
.di-box:hover{
  animation: show-img .2s forwards;
}
#di{
  border-radius: 8px 0 0 8px;
}
.status-bar{
  height:30px;
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  font-size:.8rem;
} 
.status{
  border-radius: 4px;
  padding: 4px 6px;
  margin-left: 4px;
  color: #ffffffcc;
  background: #0e0e0e88;
}
#st-magnification{
  cursor: pointer;
  user-select: none;
}

.tooltip{
  font-size: .8rem;
  padding: 8px;
  border-radius: 4px;
  background: #3e3e3ecc;
  color: #ffffffcc;
  position: absolute;
  display:none;
}
:hover + .tooltip{
  display:block;
}
.di-tooltip{
  top: 160px;
  right: 15px;
}

::-webkit-scrollbar {
  width: 16px;
}
::-webkit-scrollbar-thumb {
  box-shadow: inset 0 0 5px 5px #333333;
  border: solid 5px transparent;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:active {
  box-shadow: inset 0 0 10px 10px #686868;
}
::-webkit-scrollbar-button,
::-webkit-scrollbar-corner {
  display: none;
}
</style>
`;

export default IMG_STYLE;
