// * abstract all usb gamepads
//most of the code in this is from https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
// but it is modified such that this serves as a PS3 fallback for when gamepadjs doesn't work.
(function(define) {
define(["gamepadjs"],function(Gp) {
	'use strict';
	var haveEvents = 'ongamepadconnected' in window;
	var controllers = {};

	function Output() {
		var gp=new Gp();
		this._events={};
		this.namesMap={//map easy names to hard names (1-indexed)
			"shoulder_top_left":"button_5",
			"l_shoulder":"button_5",
			"shoulder_top_right":"button_6",
			"r_shoulder":"button_6",
			'shoulder_bottom_left':"button_7",
			'l_trigger':"button_7",
			'shoulder_bottom_right':"button_8",
			'r_trigger':"button_8",
			"select":"button_9",
			"start":"button_10",
			'stick_button_left': 'button_11',
			'stick_button_right': 'button_12',
			'vendor':'button_13',//this is one of those things that is unique to ps3 controllers
			//'home':'button_13',
		};
		this.on=function(e,o,f,opt) {
			//console.log(arguments,"this.on");
			if (!this.fallback) return gp.on(e,o,f);
			var self=this;
			if (e.indexOf(" ")>-1) {
				e.split(" ").forEach(function(newE) {
					self.on(newE,o,f,opt);
				});
				return;
			}
			if (typeof this.namesMap[o]==="string") o=this.namesMap[o];
			if (typeof arguments[1]==="string") {
				if (o.indexOf(" ")>-1) {
					o.split(" ").forEach(function(newO) {
						self.on(e,newO,f,opt);
					});
					return;
				}
				this.__handlers[e+"_"+o]=arguments[2];
				this.__handlers[e+"_"+o+"Opt"]=arguments[3];
				//console.log(this.__handlers);
			}else{
				this.__handlers[e]=arguments[1];
				this.__handlers[e+"Opt"]=arguments[2];
			}
		};
		this.off=function(e,o) {
			console.log(arguments);
			if (!this.fallback) return gp.on(e,o);
			var self=this;
			if (e.indexOf(" ")>-1) {
				e.split(" ").forEach(function(newE) {
					self.off(newE,o);
				});
				return;
			}
			if (typeof this.namesMap[o]==="string") o=this.namesMap[o];
			if (typeof arguments[1]==="string") {
				if (o.indexOf(" ")>-1) {
					o.split(" ").forEach(function(newO) {
						self.on(e,newO);
					});
					return;
				}
				delete this.__handlers[e+"_"+o];
			}else{
				delete this.__handlers[e];
			}
		};
		this.pause=function() {
			console.log(arguments);
			if (!this.fallback) {
				return gp.pause();
			}else console.warn("Pause failed: Currently in fallback mode.");
		};
		this.resume=function() {
			console.log(arguments);
			if (!this.fallback) {
				return gp.resume();
			}else console.warn("Resume failed: Currently in fallback mode.");
		};
		this.destroy=function() {
			console.log(arguments);
			if (!this.fallback) {
				return gp.destroy();
			}else console.warn("Destroy failed: Currently in fallback mode.");
		};
		this.setGlobalThreshold=function(num) {
			console.log(arguments);
			if (!this.fallback) {
				return gp.setGlobalThreshold();
			}else {
				this._threshold = parseFloat(num);//copied from gamepadjs
				Output.prototype._threshold=this._threshold;
			}
		};
		this.setCustomMapping=function(dev,mapp) {
			//console.log(arguments,"setCustomMapping");
			if (!this.fallback) {
				return gp.setCustomMapping(dev,mapp);
			}else console.warn("Custom mapping failed: Currently in fallback mode.");
			//{
			//	if (dev!=="keyboard") console.warn(dev,"re-mapping isn't possible while in fallback mode.");
			//	this.__kybdmap=mapp;
			//}
		};
		this._threshold=0.3;
	}
	Output.prototype._threshold=0.3;
	Output.prototype.fallback=true;//if true, this lib is used. Won't work with more than one controller (yet?)
	Output.prototype.__handlers={};
	Output.prototype.trigger=function(type, button, value, player) {
			console.log(arguments,"obj proto trigger");
			if (!this.fallback) return gp.trigger(type,button,value,player);
			if (typeof value==="undefined"){
				if (button.indexOf("axis")>-1) {
					value=[0,0];
					console.warn("Value needs to be defined!");
				}else value=1;
			}
			var e={
				button:button,
				player:player,
				value:value,
				timestamp:Date.now(),
				event:{
					button:button,
					type:type,
				},
				type:type,
			};
			//console.log(this.__handlers,e,type+"_"+button);
			e.event.callback=this.__handlers[type+"_"+button];
			e.event.options=this.__handlers[type+"_"+button+"Opt"];
			if (typeof this.__handlers[type+"_"+button]==="function")
				this.__handlers[type+"_"+button](e);
		};

	function connecthandler(e) {
			//console.log(arguments,"connecthandler");
		//Output.prototype.__handlers.connect(e.gamepad);
		addgamepad(e.gamepad);
	}

	function addgamepad(gamepad) {
			//console.log(arguments,"add gp");
		if (gamepad.id.indexOf(": 0000")>-1) {
			console.warn(gamepad,"ignored!");
			return;//don't count unknown gamepads
		}
		//console.log(gamepad.axes[gamepad.axes.length-1]>1);
		//var dtype=0;
		if (!(gamepad.axes[gamepad.axes.length-1]<-1||gamepad.axes[gamepad.axes.length-1]>1||gamepad.buttons.length<16)) {
			Output.prototype.fallback=false;
			//if (gamepad.buttons.length<16) dtype=1;
			return;
		}
		controllers[gamepad.index] = gamepad;
		Output[gamepad.index]={
			gamepad:gamepad,
			//dpad:[0,0];val
			//dpadType:dtype,
			dpadStart:gamepad.axes[gamepad.axes.length-1],//this is what the value will be when no buttons are being pressed.
			dpadLast:gamepad.axes[gamepad.axes.length-1],
			lstick:[0,0],
			rstick:[0,0],
			buttons:new Array(gamepad.buttons.length),
			lastButtons:new Array(gamepad.buttons.length),
			lastAxes:new Array(gamepad.axes.length),
			//buttonEvents:new Array(gamepad.buttons.length),
			//anyButton:function() {},
			//anyButtonZeros:function() {},
			timestamp:gamepad.timestamp,
		};
		if (typeof Output.prototype.__handlers.connect==="function") Output.prototype.__handlers.connect(gamepad);
		requestAnimationFrame(updateStatus);
	}
	function disconnecthandler(e) {
			console.log(arguments,"disGP");
		removegamepad(e.gamepad);
	}
	function removegamepad(gamepad) {
			console.log(arguments,"remGP");
		delete controllers[gamepad.index];
		delete Output[gamepad.index];
		if (!Output.fallback) return;
		if (typeof Output.prototype.__handlers.disconnect==="function") Output.prototype.__handlers.disconnect(gamepad);
	}
	function updateStatus() {
		if (!haveEvents) {
			scangamepads();
		}
		if (!Output.prototype.fallback) return;//let the other library take care of it
		var i = 0;
		var j;
		for (j in controllers) {
			var controller = controllers[j];
			for (i = 0; i < controller.buttons.length; i++) {
				var val = controller.buttons[i];
				var pressed = val == 1.0;
				if (typeof(val) == "object") {
					pressed = val.pressed;
					val = val.value;
				}
				if (pressed&&Output[j].lastButtons[i]) {//it has to be held for a little while
					Output.prototype.trigger("hold","button_"+(i+1),val,j);
				}
				if (pressed&&!Output[j].lastButtons[i]) {
					Output.prototype.trigger("press","button_"+(i+1),val,j);
					Output[j].lastButtons[i]=true;
				}else if (!pressed&&Output[j].lastButtons[i]){
					Output.prototype.trigger("release","button_"+(i+1),val,j);
				}
				if (!pressed){
					Output[j].lastButtons[i]=false;
				}
			}
			var la=[0,0],
				ra=[0,0];
			for (i = 0; i < controller.axes.length; i++) {
				var a = controller.axes[i];
				//a.innerHTML = i + ": " + controller.axes[i].toFixed(4);
				//a.setAttribute("value", controller.axes[i] + 1);
				//console.log(controller.axes[i]+1);
				if (i===controller.axes.length-1) {
					if (Output[j].dpadStart!==0) {
						//console.log("HI",a);
						switch(a) {//here's the magic of ps3 controllers that everyone else just couldn't figure out
							case Output[j].dpadStart:break;
							case 1:
								Output.prototype.trigger("hold","d_pad_left_up",a,j);
								if (Output[j].dpadLast!==a) Output.prototype.trigger("press","d_pad_left_up",val,j);
								break;
							case 0.7142857313156128:
								Output.prototype.trigger("hold","d_pad_left",a,j);
								if (Output[j].dpadLast!==a) Output.prototype.trigger("press","d_pad_left",val,j);
								break;
							case 0.4285714626312256:
								Output.prototype.trigger("hold","d_pad_left_down",a,j);
								if (Output[j].dpadLast!==a) Output.prototype.trigger("press","d_pad_left_down",val,j);
								break;
							case 0.14285719394683838:
								Output.prototype.trigger("hold","d_pad_down",a,j);
								if (Output[j].dpadLast!==a) Output.prototype.trigger("press","d_pad_down",val,j);
								break;
							case -0.1428571343421936:
								Output.prototype.trigger("hold","d_pad_right_down",a,j);
								if (Output[j].dpadLast!==a) Output.prototype.trigger("press","d_pad_right_down",val,j);
								break;
							case -0.4285714030265808:
								Output.prototype.trigger("hold","d_pad_right",a,j);
								if (Output[j].dpadLast!==a) Output.prototype.trigger("press","d_pad_right",val,j);
								break;
							case -0.7142857313156128:
								Output.prototype.trigger("hold","d_pad_right_up",a,j);
								if (Output[j].dpadLast!==a) Output.prototype.trigger("press","d_pad_right_up",val,j);
								break;
							case -1:
								Output.prototype.trigger("hold","d_pad_up",a,j);
								if (Output[j].dpadLast!==a) Output.prototype.trigger("press","d_pad_up",val,j);
								break;
							default:
								console.warn("D-pad state:",a,"unknown!");
						}
						if (Output[j].dpadLast!==a) {//last doesn't equal first
							switch(Output[j].dpadLast) {//here's the magic of ps3 controllers that everyone else just couldn't figure out
								case Output[j].dpadStart:break;
								case 1:
									Output.prototype.trigger("release","d_pad_left_up",val,j);
									break;
								case 0.7142857313156128:
									Output.prototype.trigger("release","d_pad_left",val,j);
									break;
								case 0.4285714626312256:
									Output.prototype.trigger("release","d_pad_left_down",val,j);
									break;
								case 0.14285719394683838:
									Output.prototype.trigger("release","d_pad_down",val,j);
									break;
								case -0.1428571343421936:
									Output.prototype.trigger("release","d_pad_right_down",val,j);
									break;
								case -0.4285714030265808:
									Output.prototype.trigger("release","d_pad_right",val,j);
									break;
								case -0.7142857313156128:
									Output.prototype.trigger("release","d_pad_right_up",val,j);
									break;
								case -1:
									Output.prototype.trigger("release","d_pad_up",val,j);
									break;
								default:
									console.warn("D-pad state:",a,"unknown!");
							}
						}
						Output[j].dpadLast=a;
					}else{
						var b=controller.axes[i-1];
						// this here's for my Nintendo Switch (TM) wired pro controller. Seems to be x-box
						if (Math.abs(a)<Output.prototype._threshold&&Math.abs(b)<Output.prototype._threshold) {
						}else if (a<Output.prototype._threshold&&b<Output.prototype._threshold) {
							console.log("hold","d_pad_left_up");
							Output.prototype.trigger("hold","d_pad_left_up",[a,b],j);
						}else if (Math.abs(a)<Output.prototype._threshold&&b<Output.prototype._threshold) {
							console.log("hold","d_pad_left");
							Output.prototype.trigger("hold","d_pad_left",[a,b],j);
						}else if (a>Output.prototype._threshold&&b<Output.prototype._threshold) {
							console.log("hold","d_pad_left_down");
							Output.prototype.trigger("hold","d_pad_left_down",[a,b],j);
						}else if (a<Output.prototype._threshold&&Math.abs(b)<Output.prototype._threshold) {
							console.log("hold","d_pad_up");
							Output.prototype.trigger("hold","d_pad_up",[a,b],j);
						}else if (a>Output.prototype._threshold&&Math.abs(b)<Output.prototype._threshold) {
							console.log("hold","d_pad_down");
							Output.prototype.trigger("hold","d_pad_left_down",[a,b],j);
						}else if (a<Output.prototype._threshold&&b>Output.prototype._threshold) {
							console.log("hold","d_pad_right_up");
							Output.prototype.trigger("hold","d_pad_right_up",[a,b],j);
						}else if (Math.abs(a)<Output.prototype._threshold&&b>0) {
							console.log("hold","d_pad_right");
							Output.prototype.trigger("hold","d_pad_right",[a,b],j);
						}else if (a>Output.prototype._threshold&&b>Output.prototype._threshold) {
							console.log("hold","d_pad_right_down");
							Output.prototype.trigger("hold","d_pad_right_down",[a,b],j);
						}else console.log(a,b,"d-pad movement not recognised");
					}
				}else if (i===0) {
					la[0]=a;
				}else if (i===1) {
					la[1]=a*-1;
				}else if (i===5) {
					ra[0]=a;
				}else if (i===2) {
					ra[1]=a*-1;
					//console.log("R",ra);
				}
			}
			if (Math.abs(la[0])>Output.prototype._threshold||Math.abs(la[1])>Output.prototype._threshold) {
				Output.prototype.trigger("hold","stick_axis_left",la,j);
				Output[j].lstick=la;
			}else if ((Output[j].lstick[0]!==la[0]&&Math.abs(Output[j].lstick[0])>0)||
					  (Output[j].lstick[1]!==la[1]&&Math.abs(Output[j].lstick[1])>0)) {
				Output.prototype.trigger("release","stick_axis_left",la,j);
				Output[j].lstick=[0,0];
			}
			if (Math.abs(ra[0])>Output.prototype._threshold||Math.abs(ra[1])>Output.prototype._threshold) {
				Output.prototype.trigger("hold","stick_axis_right",ra,j);
				Output[j].rstick=ra;
			}else if ((Output[j].rstick[0]!==ra[0]&&Math.abs(Output[j].rstick[0])>0)||
					  (Output[j].rstick[1]!==ra[1]&&Math.abs(Output[j].rstick[1])>0)) {
				Output.prototype.trigger("release","stick_axis_right",ra,j);
				Output[j].rstick=[0,0];
			}
		}
		requestAnimationFrame(updateStatus);
	}
	function scangamepads() {//search for new gamepads
			//console.log(arguments,"scan");
		if (!Output.fallback) return;
		var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
		for (var i = 0; i < gamepads.length; i++) {
			if (gamepads[i]) {
				if (gamepads[i].index in controllers) {
					controllers[gamepads[i].index] = gamepads[i];
				} else {
					addgamepad(gamepads[i]);
				}
			}
		}
	}
	window.addEventListener("gamepadconnected", connecthandler);
	window.addEventListener("gamepaddisconnected", disconnecthandler);
	if (!haveEvents) {
		setInterval(scangamepads, 500);
	}
	//console.log(typeof Output);
	return Output;
});
})(typeof module!=="undefined"&&typeof define==="undefined"&&typeof window!=="undefined"?function(deps,f) {//if it is in electron
	module.exports=f(window.Gpjs);
}:define);
