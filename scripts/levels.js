(function(define) {define(function() {var sc=4;return {sc:sc,list:[//note to nathan (from nathan): remove all spaces from levels before making minified version
//DONT EDIT ANYTHING AT OR ABOVE THIS LINE			
/*code to item reference
	BG tile
-	top wall
_	bottom wall
|#	left wall
#|	right wall
#	no walls
=	top and bottom walls
||	left and right walls
a	wall on all sides
a|	wall on all sides but the right side
|a	wall on all sides but the left side
a_	wall on all sides but bottom
a-	wall on all sides but top
c/	wall on right and bottom (thus "c" means "corner")
c\\	wall on right and top (both \ characters are needed this holds true for anything else that has two)
/c	wall on left and top
\\c wall on left and bottom
#/	angle wall replacing right bottom corner
-#/	wall on top, angle wall replacing right bottom corner
|#/	wall on left and angle wall replacing right bottom corner
/#	angle wall replacing left top corner
/#|	angle wall replacing left top corner and wall on right
/#_ angle wall replacing left top corner and wall on bottom
#\\ angle wall replacing right top corner
|#\\	wall on left and angle wall replacing right top corner
_#\\	wall on bottom and angle wall replacing right top corner
\\#	angle wall replacing left bottom corner
\\#|	angle wall replacing left bottom corner and wall on right
\\#-	angle wall replacing left bottom corner and wall on top
.	button (can be no more (per level) than there are colors available)
p	portal (can only be exactly one (per level))
s_	spikes pointing up (I can very easily add the three other angles, but no need has been found. Tell me if you need down, right or left spikes. It will be easy to add.
b	circle bumper
spn	spawn point
l	left paddle (can have any amount), about 3 blocks wide
r	right paddle (can have any amount), about 3 blocks wide
spr	spring (historically doesn't work. I may have disabled it to prevent things from getting bad)
h	hedge (breakable with scissor powerup)
s	Scissors (powerup that can break hedge blocks)
Any number of spaces can be inserted before or after a symbol.
Commas seperate blocks. If no symbol is between any symbol, then that is a BG tile (you will notice that I said this before. This is for clarity)
All lines must begin with a quote and end with a quote followed by a comma (see level 1)
all levels must begin with a [ and end with ],
the first three numbers in a level indicate (in pixels) the following:
	* The x-position of the center of the screen, relative to the leftmost block.
	* The amount of space to the left and right of the ball there should be. (think like it's the width of an oval)
	* The amount of space above and below the ball there should be. (think like it's the hight of an oval)
*/
[
	(16*sc*8.5),//camera initial offset (Width of block, times scaleFactor(must be present), times number of blocks)
	16*(sc/2)*20,//padding W
	16*(sc/2)*9,//padding H
	"a|,=   ,=  ,=  ,=   ,=   ,= ,= ,= ,=  ,=  ,= ,=  ,=  ,=  ,a_ ,|a ,a_",
	"||,    ,   ,   ,p   ,    ,  ,  ,  ,   ,   ,  ,/c ,-#/,   ,\\#,c\\,||",
	"||,    ,   ,   ,    ,    ,  ,  ,  ,   ,   ,  ,|#/,   ,   ,   ,\\#,|a",
	"||,    ,   ,   ,    ,    ,  ,  ,  ,   ,   ,  ,   ,   ,   ,   ,   ,||",
	"||,    ,   ,   ,    ,    ,  ,  ,  ,   ,   ,  ,   ,   ,/#|,spn,   ,||",
	"||,    ,   ,   ,    ,    ,  ,  ,  ,   ,   ,  ,   ,   ,|| ,   ,   ,a-",
	"a|,_#\\,   ,   ,    ,    ,  ,  ,  ,   ,   ,  ,   ,   ,|| ,   ,   ,r ",
	"||,l   ,   ,   ,    ,    ,  ,  ,  ,   ,   ,  ,   ,   ,|| ,   ,   ,  ",
	"||,    ,   ,   ,    ,    ,  ,  ,  ,   ,   ,  ,   ,   ,|| ,   ,   ,  ",
	"||,    ,   ,   ,    ,    ,  ,b ,  ,   ,   ,  ,   ,   ,|| ,   ,   ,  ",
	"||,    ,   ,   ,.   ,    ,  ,  ,  ,   ,.  ,  ,   ,   ,|| ,   ,   ,  ",
	"||,    ,   ,   ,    ,    ,  ,  ,  ,   ,   ,  ,   ,/#_,|a ,   ,   ,  ",
	"a-,#\\ ,   ,   ,    ,    ,  ,  ,  ,   ,   ,  ,   ,r  ,   ,   ,   ,  ",
	"  ,\\# ,#\\,   ,    ,    ,  ,  ,  ,   ,   ,  ,/# ,-#/,   ,   ,   ,  ",
	"  ,    ,\\#,#\\,    ,    ,  ,  ,  ,   ,   ,/#,#/ ,   ,   ,   ,   ,  ",
	"  ,    ,   ,\\#,_#\\,    ,  ,  ,  ,   ,/#_,#/,   ,   ,   ,   ,   ,  ",
	"  ,    ,   ,   ,l   ,    ,  ,  ,  ,   ,r  ,  ,   ,   ,   ,   ,   ,  ",
	"  ,    ,   ,   ,    ,|#\\,  ,  ,  ,/#|,   ,  ,   ,   ,   ,   ,   ,  ",
	"  ,    ,   ,   ,    ,||  ,s_,s_,s_,|| ,   ,  ,   ,   ,   ,s_ ,s_ ,  ",
	"  ,    ,   ,   ,    ,a|  ,= ,= ,= ,|a ,   ,  ,   ,   ,   ,a| ,|a ,  ",
],
[
	(16*sc*10),
	16*(sc/2)*25,
	16*(sc/2)*9 ,
	"#  ,#  ,_  ,_  ,_  ,_  ,_  ,_  ,#  ,#  ,#  ,#  ,#  ,_  ,_  ,_   ,_  ,_  ,_  ,_  ,#  ,#		",
	"#  ,#/ ,	,	,	,	,	,   ,\\#,_  ,_  ,_  ,#/ ,	,	,	 ,	 ,	 ,	 ,	 ,\\#,#   	",
	"#| ,	,	,	,	,	,	,	,	,spn,   ,   ,	,	,	,	 ,	 ,	 ,	 ,	 ,	 ,|# 	",
	"#| ,	,	,	,	,	,	,	,	,	,   ,	,	,	,	,	 ,	 ,	 ,	 ,	 ,	 ,|# 	",
	"#| ,	,	,	,	,	,	,	,	,	,   ,   ,	,	,	,	 ,	 ,	 ,	 ,	 ,	 ,|# 	",
	"#| ,	,	,	,	,	,	,	,	,	,   ,   ,	,	,	,	 ,	 ,	 ,	 ,	 ,	 ,|# 	",
	"#| ,.	,   ,	,   ,.  ,	,	,	,	,   ,	,	,	,	,	 ,	 ,.  ,	 ,	 ,.  ,|# 	",
	"#| ,	,	,	,	,	,	,	,	,	,   ,p  ,	,	,	,	 ,	 ,	 ,	 ,	 ,	 ,|# 	",
	"#| ,	,	,	,	,	,	,	,	,   ,/# ,#\\,   ,	,	,	 ,	 ,	 ,	 ,	 ,	 ,|# 	",
	"#| ,   ,   ,   ,   ,   ,   ,   ,   ,/# ,#  ,#  ,#\\,   ,   ,    ,   ,   ,   ,   ,   ,|# 	",
	"#| ,	,	,	,	,	,   ,   ,/# ,#  ,#  ,#  ,#  ,#\\,   , 	 ,	 ,	 ,	 ,	 ,	 ,|# 	",
	"#| ,	,	,	,	,   ,   ,/# ,\\c,\\c,\\c,\\c,\\c,\\c,#\\,    ,	 ,	 ,	 ,	 ,	 ,|# 	",
	"c/ ,	,	,	,   ,   ,/#_,-  ,-  ,-  ,-  ,-  ,-  ,-  ,-  ,_#\\,   ,	 ,	 ,	 ,	 ,\\c	",
	"l  ,	,	,   ,   ,   ,r  ,a- ,a- ,a- ,a- ,a- ,a- ,a- ,a- ,l   ,   ,   ,	 ,	 ,   ,r	    ",
	"c\\,	,	,	,	,   ,/c ,|| ,|| ,|| ,|| ,|| ,|| ,|| ,|| ,c\\ ,	 ,	 ,	 ,	 ,   ,/c 	",
	"#| ,s_ ,s_ ,s_ ,s_ ,s_ ,|# ,a  ,a  ,a  ,a  ,a  ,a  ,a  ,a  ,#|  ,s_ ,s_ ,s_ ,s_ ,s_ ,|#  	",
	"#  ,-  ,-  ,-  ,-  ,-  ,#  ,#  ,#  ,#  ,#  ,#  ,#  ,#  ,#  ,#   ,-  ,-  ,-  ,-  ,-  ,#  	",
],
[
	(16*sc*7.5),//camera initial offset (Width of block, times scaleFactor(must be present), times number of blocks)
	16*(sc/2)*18,//padding W
	16*(sc/2)*9 ,//padding H
	"#  ,#  ,#  ,#  ,#   ,#  ,#  ,#  ,#  ,#  ,#   ,#   ,#  ,#  ,#  ,#  ",
	"#  ,#  ,#  ,#  ,#   ,#  ,_  ,_  ,_  ,#  ,#   ,#   ,#  ,#  ,#  ,#  ",
	"#  ,#  ,#  ,#  ,#   ,#/ ,   ,p  ,   ,\\# ,#  ,#   ,#  ,#  ,#  ,#  ",
	"#  ,#  ,_  ,_  ,#/  ,   ,   ,   ,   ,   ,\\# ,_   ,_  ,#  ,# ,#  ",
	"#	,#/ ,   ,h  ,    ,   ,   ,   ,   ,   ,    ,h   ,   ,\\# ,# ,#  ",
	"#| ,   , . ,h  ,    ,   ,   ,   ,   ,   ,    ,h   , . ,   ,|# ,#  ",
	"#| ,   ,   ,h  ,    ,   ,   ,   ,   ,   ,    ,h   ,   ,   ,|# ,#  ",
	"#  ,#\\,   ,h  ,    ,   ,   ,   ,   ,   ,    ,h   ,   ,/# ,#  ,#  ",
	"#  ,#  ,#\\,h  ,    ,   ,   ,   ,   ,   ,    ,h   ,/# ,#  ,#  ,#  ",
	"#  ,#  ,#| ,l  ,|#\\,h  ,h  ,h  ,h  ,h  ,/#_ ,r   ,|# ,#  ,#  ,#  ",
	"#  ,#  ,#  ,-  ,#/  ,   ,   ,   ,   ,   ,    ,    ,\\#,#  ,#  ,#  ",
	"#  ,#  ,#  ,#/ ,    ,   ,   ,   ,   ,   ,    ,|#\\,   ,\\#,#  ,#  ",
	"#  ,#  ,#/ ,   ,    ,   ,   ,   ,   ,   ,    ,\\# ,#\\,   ,|# ,_  ", 
	"#  ,#| ,   ,   ,    ,   ,   ,   ,   ,   ,    , s  ,|| ,spn,|| ,r  ",
	"#  ,#  ,#\\,   ,    ,   ,   ,   ,   ,   ,    ,    ,|# ,-  ,#  ,-  ",
	"#  ,#  ,#  ,#\\,    ,   ,   ,   ,   ,   ,    ,/#  ,#  ,#  ,#  ,#  ",
	"#  ,#  ,#  ,#  ,_#\\ ,   ,   ,   ,   ,   ,/#_,#   ,#  ,#  ,#  ,#  ",
	"#  ,#  ,#  ,#| ,l   ,   ,   ,   ,   ,   ,r   ,|#  ,#  ,#  ,#  ,#  ",
	"#  ,#  ,#  ,#  ,c\\ ,   ,   ,   ,   ,   ,/c  ,#   ,#  ,#  ,#  ,#  ",
	"#  ,#  ,#  ,#  ,#|  ,   ,   ,   ,   ,   ,|#  ,#   ,#  ,#  ,#  ,#  ",
	"#  ,#  ,#  ,#  ,#   ,s_ ,s_ ,s_ ,s_ ,s_ ,#   ,#   ,#  ,#  ,#  ,#  ",
],
//DON'T EDIT ANYTHING AT OR BELOW THIS LINE
]};})})(typeof module!=="undefined"&&typeof define==="undefined"&&typeof window!=="undefined"?function(f) {module.exports=f();}:define)