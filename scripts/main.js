function main(Matter,l$,Gp,levelThing) {
	'use strict';
	var sc=levelThing.sc,
		lifeCount=3,
		prsdbtns=0,
		portalAnimationFrame=1,
		levels=levelThing.list,
		lpaddles=[],
		rpaddles=[],
		circlebBumpers=[],
		level=prompt("WELCOME TO \n\nBack to the Bin!\n\nWhat level do you want to start at?\n1. The Workshop\n2. The Freezer\n3. The Garden")-1;
		//level=2;
		//level=0;
	if (level>=levels.length) {
		alert("Level "+(level-0+1)+" not found!");
		level=0;//this prevents it from saying that the player won.
		window.location.reload();
	}
	var Engine=Matter.Engine,
		Render=Matter.Render,
        Runner = Matter.Runner,
		World=Matter.World,
		Bodies=Matter.Bodies,
		Events=Matter.Events,
        //MouseConstraint = Matter.MouseConstraint,
        //Mouse = Matter.Mouse,
		engine=Engine.create(),//Create a new engine
		world=engine.world,
		portalG=false,//Bodies.rectangle(242, 510, 200, 60, { isStatic: true }),
		portalB=false,
		sizzers=false,
		//largerWorHval=window.outerHeight>window.outerWidth?window.outerHeight:window.outerWidth,
		render=Render.create({
					element: $("#container")[0],
					engine: engine,
					options: {
						//width: window.innerWidth,
						//height: window.innerHeight,
						width: window.outerWidth,
						height: window.outerHeight,
						//width: largerWorHval,
						//height: largerWorHval,
						wireframes: false,
						background:'none',
						//pixelRatio:1/4,//mess with this later, call it "pain mode?"
					}
				 }),
		firstIterator=0,
		lastIterator=0,
		hasPlayedBeforeFreezer=false,
		ball,balls=[];
	Render.run(render);
    var runner = Runner.create();
	/* window.onresize=function() {
		return;
		Render.stop(render);
		document.getElementById("container").innerHTML="<canvas width=\""+window.innerWidth+"\" width=\""+window.innerHeight+"\" style=\"background: none 0% 0% / contain;\"></canvas>";
		render.canvas=document.getElementById("container").firstChild;
		//Render.run(render);
		render=Render.create({
					canvas:document.getElementById("container").firstChild,
					engine: engine,
					options: {
						width: window.innerWidth,
						height: window.innerHeight,
						wireframes: false,
						background:'none',
					}
				 });
		Render.run(render);
	} */
    render.context.imageSmoothingEnabled = false;
	Events.on(render, "beforeRender", function() {
		Render.lookAt(render,{position:{y:ball.position.y,x:levels[level][0]}},{x:levels[level][1],y:levels[level][2]});
		if (prsdbtns===buttons.length&&portalAnimationFrame<=9) {
			if(portalAnimationFrame%1===0) portalG.render.sprite.texture="sprites/exit portal/sprite_0"+(portalAnimationFrame)+".png";
			portalAnimationFrame=(Math.floor(10*portalAnimationFrame)+1)/10;
		}else if (prsdbtns===buttons.length&&portalAnimationFrame>9) {
			World.remove(world,portalG);
			World.remove(world,buttons);
		}
	});
	var paddlePoints=[[16,24],[23,24],[53,29],[55,31],[55,33],[53,35],[24,40],[16,40],[13,38],[11,35],[11,29],[13,26]];
	paddlePoints.map(function(v,i) {
	    paddlePoints[i]=Matter.Vector.mult(Matter.Vector.create(sc*v[0]/4,sc*v[1]/4),4);
	});
	var squareColliderPoints=[[0,0],[16,0],[16,16],[0,16]];
	squareColliderPoints.map(function(v,i) {
	    squareColliderPoints[i]=Matter.Vector.mult(Matter.Vector.create(sc*v[0]/4,sc*v[1]/4),4);
	});
	var btnColliderPoints=[[0,0],[16,0],[16,16],[0,16]];
	squareColliderPoints.map(function(v,i) {
	    btnColliderPoints[i]=Matter.Vector.mult(Matter.Vector.create(sc*v[0]/4,sc*v[1]/4),4);
	});
	var triColliderPoints=[[0,0],[16,0],[16,16]];
	triColliderPoints.map(function(v,i) {
	    triColliderPoints[i]=Matter.Vector.mult(Matter.Vector.create(sc*v[0]/4,sc*v[1]/4),4);
	});
	var buttons=[],spikes=[],canCut=false,hedges=[];
	function renderGrid() {
		if (level<=-1) {
			level=0;
		}
		if (level===levels.length) {
			alert("YOU WIN!");
			window.location.reload();
		}
		/* $("#bgm1")[0].pause();
		$("#bgm2")[0].pause();
		$("#bgm3")[0].pause();
		$("#bgm1")[0].currentTime = 0;
		$("#bgm2")[0].currentTime = 0;
		$("#bgm3")[0].currentTime = 0;
		if (level===0){
			$("#bgm1")[0].play();
		}else if (level===1) {
			$("#bgm2")[0].play();
		}else $("#bgm3")[0].play(); */
		if (lifeCount<0) {
			alert("GAME OVER");
			window.location.reload();
		}
		var levelSkin=level===0?"workshop":level===1?"freezer":"garden";
		for (var y=3; y<levels[level].length; y++) {
			if (typeof levels[level][y]=="string") levels[level][y]=levels[level][y].replace(/\s/g,"").split(",");
			for (var x=0; x<levels[level][y].length; x++) {
				var pos=[(16*(x)*sc),(16*(y-3)*sc)];
				var squareShape = Bodies.fromVertices(pos[0], pos[1], squareColliderPoints, {
					collisionFilter: {
						category: 0x0002,
						mask:0x0002,
					},
					render: {
						sprite: {
							texture: "sprites/"+levelSkin+"/walls/sprite_00.png",
							xScale: sc,
							yScale: sc,
						},
					},
					isStatic:true,
				});
				World.add(engine.world,squareShape);
				switch (levels[level][y][x]) {
					case "-"://top wall
					case "_"://bottom wall
					case "|#"://left wall
					case "#|"://right wall
					case "#"://solid wall
					case "="://top and  bottom wall
					case "||"://l and r wall
					case "a"://solitary wall
					case "a|"://all but right wall
					case "|a"://all butleft wall
					case "a_"://all but bottom wall
					case "a-"://all but top wall
					case "c/"://corner (c is the filled)
					case "c\\"://corner (c is the filled)
					case "/c"://corner (c is the filled)
					case "\\c":{//corner (c is the filled)
						var texture="2";
						if (levels[level][y][x]==="="||
							levels[level][y][x]==="||") texture="6";
						if (levels[level][y][x]==="#"||
							levels[level][y][x]==="r"||
							levels[level][y][x]==="l") texture="1";
						if (levels[level][y][x]==="a|"||
							levels[level][y][x]==="|a"||
							levels[level][y][x]==="a-"||
							levels[level][y][x]==="a_") texture="5";
						if (levels[level][y][x]==="c\\"||
							levels[level][y][x]==="c/"||
							levels[level][y][x]==="/c"||
							levels[level][y][x]==="\\c") texture="3";
						if (levels[level][y][x]==="a") texture="4";
						var squareShape = Bodies.fromVertices(pos[0], pos[1], squareColliderPoints, {
							collisionFilter: {
								category: 0x0001,
								mask:0x0001,
							},
							render: {
								sprite: {
									texture: "sprites/"+levelSkin+"/walls/sprite_0"+texture+".png",
									xScale: sc,
									yScale: sc,
								},
							},
							isStatic:true
						});
						if (levels[level][y][x]==="-"||
							levels[level][y][x]==="="||
							levels[level][y][x]==="/c"||
							levels[level][y][x]==="a|") Matter.Body.setAngle(squareShape,Math.PI/2);
						if(levels[level][y][x]==="_"||
							levels[level][y][x]==="c/"||
							levels[level][y][x]==="|a") Matter.Body.setAngle(squareShape,-1*Math.PI/2);
						if (levels[level][y][x]==="#|"||
							levels[level][y][x]==="c\\"||
							levels[level][y][x]==="a_") Matter.Body.setAngle(squareShape,Math.PI);
						World.add(engine.world,squareShape);
					}
					break;
					case "-#/":  // diag (# is the filled)
					case "#/":   // diag (# is the filled)
					case "/#":   // diag (# is the filled)
					case "/#|":  // diag (# is the filled)
					case "|#/":  // diag (# is the filled)
					case "/#_":  // diag (# is the filled)
					case "#\\":  // diag (# is the filled)
					case "|#\\": // diag (# is the filled)
					case "_#\\": // diag (# is the filled)
					case "\\#":  // diag (# is the filled)
					case "\\#|": // diag (# is the filled)
					case "\\#-":{// diag (# is the filled)
						var texture="7";
						if (levels[level][y][x]==="/#|"||
							levels[level][y][x]==="|#/"||
							levels[level][y][x]==="_#\\"||
							levels[level][y][x]==="\\#-") {
							texture="8";
						}
						if (levels[level][y][x]==="/#_"||
							levels[level][y][x]==="|#\\"||
							levels[level][y][x]==="-#/"||
							levels[level][y][x]==="\\#|") {
							texture="9";
						}
						var triShape = Bodies.fromVertices(pos[0], pos[1], triColliderPoints, {
							collisionFilter: {
								category: 0x0001,
								mask:0x0001,
							},
							render: {
								sprite: {
									texture: "sprites/"+levelSkin+"/walls/sprite_0"+texture+".png",
									xScale: sc,
									yScale: sc,
								},
							},
							isStatic:true
						});
						if (levels[level][y][x]==="#/"||
							levels[level][y][x]==="-#/"||
							levels[level][y][x]==="|#/") {
							Matter.Body.rotate(triShape,-1*Math.PI/2);
							Matter.Body.translate(triShape,{x:sc*-11/4,y:sc*-11/4});
						}else if (levels[level][y][x]==="/#"||
								  levels[level][y][x]==="/#|"||
								  levels[level][y][x]==="/#_") {
							Matter.Body.rotate(triShape,Math.PI/2);
							Matter.Body.translate(triShape,{x:sc*11/4,y:sc*11/4});
						}else if (levels[level][y][x]==="#\\"||
								  levels[level][y][x]==="|#\\"||
								  levels[level][y][x]==="_#\\") {
							Matter.Body.rotate(triShape,Math.PI);
							Matter.Body.translate(triShape,{x:sc*-11/4,y:sc*11/4});
						}else Matter.Body.translate(triShape,{x:sc*11/4,y:sc*-11/4});
						World.add(engine.world,triShape);
					break;
					}
					case ".":{//button
						var num="0"+(buttons.length*2);
						var squareShape = Bodies.fromVertices(pos[0], pos[1], squareColliderPoints, {
							collisionFilter: {
								category: 0x0001,
								mask:0x0001,
							},
							render: {
								sprite: {
									texture: "sprites/Switches/sprite_"+(num.substring(num.length-3))+".png",
									xScale: sc,
									yScale: sc,
								},
							},
							isStatic:true,
							isSensor:true
						});
						buttons.push(squareShape);
					break;
					}
					case "p":{
						portalB = Bodies.fromVertices(pos[0], pos[1], squareColliderPoints, {
							collisionFilter: {
								category: 0x0001,
								mask:0x0001,
							},
							render: {
								sprite: {
									texture: "sprites/exit portal/sprite_00.png",
									xScale: sc,
									yScale: sc,
								},
							},
							isStatic:true,
							isSensor:true
						});
						World.add(engine.world,portalB);
						portalG = Bodies.fromVertices(pos[0], pos[1], squareColliderPoints, {
							collisionFilter: {
								category: 0x0002,
								mask:0x0002,//It's category & mask 2 because it doesn't need to be checked for, so it will speed things up.
							},
							render: {
								sprite: {
									texture: "sprites/exit portal/sprite_01.png",
									xScale: sc,
									yScale: sc,
								},
							},
							isStatic:true,
							isSensor:true
						});
						World.add(engine.world,portalG);
						setInterval(function() {
							Matter.Body.rotate(portalB,-1*Math.PI/2);
						},100);//Sometimes, the paddle thing stops this animation.
					break;
					}
					case "s_":{//Spikes pointing up
						var squareShape = Bodies.fromVertices(pos[0], pos[1], squareColliderPoints, {
							collisionFilter: {
								category: 0x0001,
								mask:0x0001,
							},
							render: {
								sprite: {
									texture: "sprites/"+levelSkin+"/walls/sprite_10.png",
									xScale: sc,
									yScale: sc,
								},
							},
							isStatic:true,
						});
						World.add(engine.world,squareShape);
						spikes.push(squareShape);
					break;
					}
					case "b":{
						var circlebBumper = Bodies.circle(pos[0], pos[1], 8*sc*1.5, {
							collisionFilter: {
								category: 0x0001,
								mask:0x0001,
							},
							render: {
								sprite: {
									texture: "sprites/bumper/sprite_0.png",
									xScale: sc,
									yScale: sc
								}
							},
							isStatic:true
						});
						Matter.Body.setAngularVelocity(circlebBumper,(3*sc)/4);
						circlebBumpers.push(circlebBumper);
					break;
					}
					case "spn":{//spawn point
						ball = Bodies.circle(pos[0],pos[1], 8*sc, {
							collisionFilter: {
								category: 0x0001,
								mask:0x0001,
							},
							render: {
								sprite: {
									texture: "sprites/marbles/sprite_"+Math.floor(Math.random()*9)+".png",
									xScale: sc,
									yScale: sc
								}
							}
						});
						balls.push(ball);
						break;
					}
					case "s":{
						//if (levelSkin!=="garden") alert("s falling back to garden!");
						sizzers = Bodies.fromVertices(pos[0], pos[1], squareColliderPoints, {
							collisionFilter: {
								category: 0x0001,
								mask:0x0001,
							},
							render: {
								sprite: {
									texture: "sprites/garden/sprite_1.png",
									xScale: sc,
									yScale: sc,
								},
							},
							isStatic:true,
							isSensor:true
						});
						break;
					}
					case "h":{
						//if (levelSkin!=="garden") alert("h falling back to garden!");
						var squareShape2 = Bodies.fromVertices(pos[0], pos[1], squareColliderPoints, {
							collisionFilter: {
								category: 0x0001,
								mask:0x0001,
							},
							render: {
								sprite: {
									texture: "sprites/garden/sprite_0.png",
									xScale: sc,
									yScale: sc,
								},
							},
							isStatic:true,
						});
						hedges.push(squareShape2);
						break;
					}
					case "l":{
						var lpaddle=Bodies.fromVertices(pos[0]+(10*sc),pos[1]+(3.5*sc),paddlePoints,{
							collisionFilter: {
								category: 0x0001,
							},
							isStatic:true,
							render:{
								sprite:{
									texture:"sprites/"+levelSkin+"/paddle/sprite_0.png",
									xScale:sc,
									yScale:sc,
								},
							}
						});
						Matter.Body.setAngle(lpaddle,Math.PI/8);
						//World.add(engine.world,lpaddle);
						lpaddles.push(lpaddle);
						break;
					}
					case "r":{
						var a=level!=2?0:1;
						var rpaddle = Bodies.fromVertices(pos[0]-(10*sc), pos[1]+(3.5*sc), paddlePoints, {
							collisionFilter: {
								category: 0x0001,
							},
							render: {
								sprite: {
									texture: "sprites/"+levelSkin+"/paddle/sprite_"+a+".png",
									xScale: sc,
									yScale: sc,
								},
							},
							isStatic:true
						});
						Matter.Body.setAngle(rpaddle,7*Math.PI/8);
						//World.add(engine.world,rpaddle);
						rpaddles.push(rpaddle);
						break;
					}
					case undefined: //empty
					case "":break;
					default:console.warn(levels[level][y][x],"not found!");
				}
			}
		}
		/* if (!portalB) {
			var val=prompt("WARNING:\n\n No portal could be found in the "+levelSkin+" map. \n(IF YOU ARE A PLAYTESTER, "+(hasPlayedBeforeFreezer?"THIS MEANS THAT YOU WON! CONGRATS!":"YOU SHOULD TRY PLAYING A DIFFERENT LEVEL")+". \nPRESS ENTER)\n Enter level to swap with:")
			if (!val) window.location.reload();
			if (val>levels.length) {
				alert("Level "+(val-0+1)+" not found!");
				window.location.reload();
			}
			levels[2]=levels[val-1];
			resetAll();
		}
		if (balls.length==0) {
			var val=prompt("WARNING:\n\n No ball could be found in the "+levelSkin+" map. \n(IF YOU ARE A PLAYTESTER, "+(hasPlayedBeforeFreezer?"THIS MEANS THAT YOU WON! CONGRATS!":"YOU SHOULD TRY PLAYING A DIFFERENT LEVEL")+". \nPRESS ENTER)\n Enter level to swap with:");
			if (!val) window.location.reload();
			if (val>levels.length) {
				alert("Level "+(val-0+1)+" not found!");
				window.location.reload();
			}
			levels[2]=levels[val-1];
			resetAll();
		} */
		World.add(engine.world,buttons);
		World.add(engine.world,hedges);
		World.add(engine.world,circlebBumpers);
		World.add(engine.world,rpaddles);
		World.add(engine.world,lpaddles);
		if (sizzers!==false) World.add(engine.world,sizzers);
		World.add(engine.world,balls);
		$("#lives").html((new Array(lifeCount).fill("&bull;&nbsp;")).join(""));
	}
	renderGrid();
	var lastPaddleGlitchPatch=0;
	function killPaddleGlitch() {
		var a=setInterval(function() {},1);
		//ignore the latest animations, but kill the rest
		for(var i=Math.floor(4*lastPaddleGlitchPatch/5);i<=a;i++) {// exclude most of what we have already done
			if (i==upL||i==dL||i==upR||i==dR) continue;
			clearInterval(i);
		}
		lastPaddleGlitchPatch=a;
	}
	function resetAll() {
		World.remove(world,Matter.Composite.allBodies(world));
		while (Matter.Composite.allBodies(world).length>0) {console.log(".")}
		rpaddles=[];
		lpaddles=[];
		balls=[];
		hedges=[];
		buttons=[];
		circlebBumpers=[];
		prsdbtns=0;
		portalAnimationFrame=1;
		sizzers=false;
		canCut=false;
		killPaddleGlitch();
		clearInterval(upL);//these intervals are ignored by `killPaddleGlitch();`
		clearInterval(upR);
		clearInterval(dL);
		clearInterval(dR);
		oldPaddleVals=[0,0];
		paddleVals=[0,0];
		renderGrid();
	}
	Events.on(engine, 'collisionActive', function(event) {
		for (var i = 0, j = event.pairs.length; i != j; ++i) {
			for (var bI=0; bI<balls.length; bI++) {
				if (event.pairs[i].bodyA===balls[i]||event.pairs[i].bodyB===balls[i]){
					for (var ii=0; ii<spikes.length; ii++) {
						if (spikes[ii]==event.pairs[i].bodyA){
							World.remove(world,event.pairs[i].bodyB);
							resetAll();
							lifeCount--;
							return;
						}else if (spikes[ii]==event.pairs[i].bodyB){
							World.remove(world,event.pairs[i].bodyA);
							lifeCount--;
							resetAll();
							return;
						}
					}
					if (canCut) {//copy to below to allow for millisecond bumps (only if moded)
						for (var ii=0; ii<hedges.length; ii++) {
							if (event.pairs[i].bodyB===balls[i]&&event.pairs[i].bodyA === hedges[ii]) {
								World.remove(world,hedges[ii]);
							}else if (event.pairs[i].bodyA===balls[i]&&event.pairs[i].bodyB === hedges[ii]) {
								World.remove(world,hedges[ii]);
							}
						}
					}	
				}
			}
		}
	});
	Events.on(engine, 'collisionStart', function(event) {
		var pairs = event.pairs;
		for (var i = 0, j = pairs.length; i != j; ++i) {
			for (var bI=0; bI<balls.length; bI++) {
				if (pairs[i].bodyA===balls[i]||pairs[i].bodyB===balls[i]){
					if ((pairs[i].bodyA==portalB||pairs[i].bodyB==portalB)&&prsdbtns==buttons.length) {
						level++;
						lifeCount++;
						hasPlayedBeforeFreezer=true;
						resetAll();
					}
					if (pairs[i].bodyA==sizzers||pairs[i].bodyB==sizzers) {
						World.remove(world,sizzers);
						canCut=true;
					}
					if (canCut) {//copy from above to allow for millisecond bumps
						for (var ii=0; ii<hedges.length; ii++) {
							if (pairs[i].bodyB===balls[i]&&pairs[i].bodyA === hedges[ii]) {
								World.remove(world,hedges[ii]);
							}else if (pairs[i].bodyA===balls[i]&&pairs[i].bodyB === hedges[ii]) {
								World.remove(world,hedges[ii]);
							}
						}
					}
					if (prsdbtns!==buttons.length){
						for (var ii=0; ii<buttons.length; ii++) {
							var num="0"+(1+(ii*2));
							var st="sprites/Switches/sprite_"+(num.substring(num.length-3))+".png";
							if (pairs[i].bodyB===balls[i]&&pairs[i].bodyA === buttons[ii]) {
								if (pairs[i].bodyA.render.sprite.texture!=st) {
									pairs[i].bodyA.render.sprite.texture=st;
									prsdbtns++;
								}else{
									var num="0"+(ii*2);
									pairs[i].bodyA.render.sprite.texture="sprites/Switches/sprite_"+(num.substring(num.length-3))+".png";
									prsdbtns--;
								}
								$("#toggle")[0].currentTime = 0;
								$("#toggle")[0].play();
							} else if (pairs[i].bodyA===balls[i]&&pairs[i].bodyB === buttons[ii]) {
								if (pairs[i].bodyB.render.sprite.texture!=st) {
									pairs[i].bodyB.render.sprite.texture="sprites/Switches/sprite_"+(num.substring(num.length-3))+".png";
									prsdbtns++;
								}else{
									var num="0"+(ii*2);
									pairs[i].bodyB.render.sprite.texture="sprites/Switches/sprite_"+(num.substring(num.length-3))+".png";
									prsdbtns--;
								}
								$("#toggle")[0].currentTime = 0;
								$("#toggle")[0].play();
							}
						}
					}
				}
			}
		}
	});
	Runner.run(runner, engine);
	var oldPaddleVals=[0,0],
		paddleVals=[0,0],
		howstrongthepaddlesare=55;
	function updateL(dir) {
		for (var i=0; i<lpaddles.length; i++) {
			var lpaddle=lpaddles[i];
			if (oldPaddleVals[1]===paddleVals[1]) Matter.Body.setAngularVelocity(lpaddle,0);
			Matter.Body.translate(lpaddle,{x:sc*((3*oldPaddleVals[1])/4),y:sc*((35*oldPaddleVals[1])/4)});
			Matter.Body.translate(lpaddle,{x:sc*((-3*paddleVals[1])/4),y:sc*((-35*paddleVals[1])/4)});
			Matter.Body.setAngle(lpaddle,(Math.PI/8)-(paddleVals[1]*55*Math.PI/180));
			Matter.Body.setAngularVelocity(lpaddle,dir*(/*paddleVals[1]*/howstrongthepaddlesare*Math.PI/180)/2);
		}
	    oldPaddleVals[1]=paddleVals[1];
	}
	function updateR(dir) {
		for (var i=0; i<rpaddles.length; i++) {
			var rpaddle=rpaddles[i];
			if (oldPaddleVals[0]===paddleVals[0]) Matter.Body.setAngularVelocity(rpaddle,0);
			Matter.Body.translate(rpaddle,{x:sc*((-3*oldPaddleVals[0])/4),y:sc*((35*oldPaddleVals[0])/4)});
			Matter.Body.translate(rpaddle,{x:sc*((3*paddleVals[0])/4),y:sc*((-35*paddleVals[0])/4)});
			Matter.Body.setAngle(rpaddle,(7*Math.PI/8)+(paddleVals[0]*55*Math.PI/180));
			Matter.Body.setAngularVelocity(rpaddle,dir*-(/*paddleVals[0]*/howstrongthepaddlesare*Math.PI/180)/2);
		}
	    oldPaddleVals[0]=paddleVals[0];
	}
	var upL=0,dL=0,
		upR=0,dR=0,
		keyChange=function(intToClear,lr,v,ointtoclear,paddles,goal) {
			clearInterval(intToClear);
			paddleVals[lr]=v;
			return setInterval(function() {
				if ((paddleVals[lr]>=goal&&v===0)||(paddleVals[lr]<=goal&&v===1)) {
					paddleVals[lr]=goal;
					ointtoclear();//killPaddleGlitch doesn't clear everything
					killPaddleGlitch();
					for (var i=0; i<paddles.length; i++) {
						var paddle=paddles[i];
						Matter.Body.setAngularVelocity(paddle,0);
					}
				}else{
					if (v===0) paddleVals[lr]+=0.04;
					else paddleVals[lr]-=0.04;
					if (lr===1) updateL((v*2)-1);//convert v into either -1 or 1, indicating the direction that the marble should be pushed
					else updateR((v*2)-1);
				}
			},0.01);
		};
	var gp=new Gp();
	gp.on('press','shoulder_top_left shoulder_bottom_left stick_button_left d_pad_left d_pad_up',function(e) {
		if (paddleVals[1]>=1) return;
		upL=keyChange(dL,1,0,function() {
			clearInterval(upL);
		},lpaddles,1);
	});
	gp.on('release','shoulder_top_left shoulder_bottom_left stick_button_left d_pad_left d_pad_up',function() {
		if (paddleVals[1]<=0) return;
		dL=keyChange(upL,1,1,function() {
			clearInterval(dL);
		},lpaddles,0);
	});
	gp.on('press','shoulder_top_right button_2 shoulder_bottom_right stick_button_right d_pad_right d_pad_up',function() {
		if (paddleVals[0]>=1) return;
		upR=keyChange(dR,0,0,function() {
			clearInterval(upR);
		},rpaddles,1);
	});
	gp.on('release','shoulder_top_right button_2 shoulder_bottom_right stick_button_right d_pad_right d_pad_up',function() {
		if (paddleVals[0]<=0) return;
		dR=keyChange(upR,0,1,function() {
			clearInterval(dR);
		},rpaddles,0);
	});
	var ldis=0,
		rdis=0;
	gp.on('hold','stick_axis_left',function(e){
		if (Math.abs(ldis-Math.max(Math.abs(e.value[0]),Math.abs(e.value[1])))<=gp._threshold) return;
		ldis=Math.max(Math.abs(e.value[0]),Math.abs(e.value[1]));
		clearInterval(dL);
		dL=keyChange(upL,1,0,function() {
			clearInterval(dL);
		},lpaddles,ldis);
	});
	gp.on('release','stick_axis_left',function(e){
		ldis=0;
		clearInterval(upL);
		upL=keyChange(dL,1,1,function() {
			clearInterval(upL);
		},lpaddles,0);
	});
	gp.on('hold','stick_axis_right',function(e){
		if (Math.abs(rdis-Math.max(Math.abs(e.value[0]),Math.abs(e.value[1])))<=gp._threshold) return;
		rdis=Math.max(Math.abs(e.value[0]),Math.abs(e.value[1]));
		clearInterval(dR);
		dR=keyChange(upR,0,0,function() {
			clearInterval(dR);
		},rpaddles,rdis);
	});
	gp.on('release','stick_axis_right',function(e){
		rdis=0;
		clearInterval(upR);
		upR=keyChange(dR,0,1,function() {
			clearInterval(upR);
		},rpaddles,0);
	});
	/*gp.on('release','vendor select',function() {
		location.reload();
	});
	gp.on('release','start',function() {
		
	});
	//*/
};
if (typeof module==="undefined") {//if i want since i'm on electron 4, I must do this until I find a better way. :/ (it's really not all that bad, but it is annoying)
	requirejs.config({
		baseUrl: 'scripts',
		paths: {
			jquery: 'ext/jquery-3.3.1',
			matter:'ext/matter',
			"poly-decomp":'ext/poly-decomp0.3.0modified',
			"gamepadjs":"ext/gamepad.js-master/gamepad",
		}
	});
	require(["matter","jquery","gamepadjs","levels",'poly-decomp'],main);
}else{
	var base=module.paths[0].replace('/node_modules',"")+"/";
	module.paths.push(base+"scripts/ext");
	module.paths.push(base+"scripts");
	main(window.Matter,window.$,window.Gpjs,window.globalLevels);
}
