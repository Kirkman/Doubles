##########################################
#                                        #
#                DOUBLES                 #
#            for Synchronet              #
#                                        #
#      author: Kirkman                   #
#       email: josh [] joshrenaud.com    #
#        date: May 26, 2014              #
#                                        #
##########################################



==========================================

INSTALLATION

Copy the DOUBLES directory into your /xtrn/ directory.
THEN...


--------------------
A. Synchronet config
--------------------

1. Launch SCFG
2. Go to External Programs > Online Programs (Doors)
3. Choose an externals section to place DOUBLES into.
4. Hit [enter] on a blank line to create a new item.
5. Change the following settings, leaving the rest as they are:

   Name                       Doubles
   Internal Code              DOUBLES
   Start-up Directory         ../xtrn/doubles
   Command Line               ?doubles.js


-------------------------
B. Scoreboard JSON config
-------------------------

DOUBLES maintains a scoreboard. You can either host your own 
scoreboard on your BBS, or you can subscribe to an inter-BBS 
scoreboard hosted on my BBS.

INTER-BBS SCOREBOARD:

1. In the Doubles directory (ie /xtrn/doubles), open 'server.ini'
2. Edit 'server.ini' to have these values:
   host = guardian.synchro.net
   port = 10088
3. Recycle services or restart Synchronet for changes to take effect.

SELF-HOSTED SCOREBOARD:

1. Make sure Synchronet's JSON database feature is turned on.
   Look in '/ctrl/services.ini' for a section like this:
   [JSON]
   Port=10088
   Options=STATIC | LOOP
   Command=json-service.js
2. Add the following section to 'ctrl/json-service.ini':
   [doubles]
   dir=../xtrn/doubles/
3. Recycle services or restart Synchronet for changes to take effect.



==========================================

RELEASE NOTES:

v1.0:
This is the initial release of the game. Likely there are bugs.
Some specific things you could look for:
  * Does the inter-BBS scoreboard work right?
  * Does the high score list display properly?

If you find any, just email me at the address above.

Future plans:
* Add tiles higher than 2048. This game has no upper limit.
* Add an instructions screen
* Explore whether it is feasible to animate tiles so that they slide.
* I'd like to add a "Threes" mode, which makes the game play like
  Threes for iOS. There are a lot of hurdles, though, and I can't
  promise I will complete it.



==========================================

MY STORY:

I have loved BBS door games since I was a teen, but I this is my
first time making one of my own. For that reason, I will now tell 
more of the game's backstory than you probably want to read. :)

My daughter Jadzia suggested that I make this game. One night while
our family was eating dinner, she said "You should make a BBS 
version of 'Threes,' Dad." Threes is a popular game for iOS, which
has spawned innumerable clones.

One of the most popular clones is called "2048." There are many
implementations of 2048 in Javascript. The most popular of these
(but not the first) was created by Gabrielle Cirulli.

Because Synchronet offers JS support, I thought it would be easy
to port one of these games. I could leave the game logic intact, 
and change just the functions for graphics, users, and scorekeeping.

I decided to adapt the version of "2048" by Sami "Saming" Romdhana,
because of his simple code structure. 

As usually happens, the port wasn't quite as straightforward as
I originally envisioned. Besides the BBS-specific changes, I realized
late in the process that Saming's "2048" moves tiles differently than 
the Cirulli's. Since I wanted my game to play like the gold standard,
I decided to redo Saming's tile movement logic.

I first tried to re-write the logic myself. I got close, but couldn't 
quite solve some issues. So I searched the web for other implementations.
I found a version by Maurits van der Schee in C which had a simple,
easy-to-understand version of the tile movement algorithm. I converted
this to Javascript, and the game was now almost perfect.

So, thanks, Jadzia, saming and mevdschee!

Thanks also to rswindell, mcmlxxix, deuce, echicken and many others
for their work on Synchronet's Javascript libaries, and for their
code examples. I have borrowed liberally.


--Kirkman


