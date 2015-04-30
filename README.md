Doubles
=======

![screenshot](http://www.breakintochat.com/files/misc/doubles-animation.gif)

DOUBLES is an ANSI adaptation of the game "2048" for Synchronet BBSes.

### Gameplay

Use the arrow keys to slide tiles in any direction. They will slide until they hit a wall, or until they bump into another tile with the same number. Tiles with the same number combine into one, doubled tile. A new tile is added to the board after each move.

Getting a "2048" tile effectively wins the game. 

You lose when the board is full and you cannot combine tiles in any direction.

### What's new?

#### v1.5
  * Added new 132x60 mode, featuring new colored tile set
  * Tweaked the "spawn new tile" algorithm
  * Added a new "difficult" mode. 
      - Game starts with 8 tiles on board instead of 2
      - New tiles can be as high as 64.
  * Removed a bug where players could spawn a new tile by pushing
    arrow keys in a direction in which they couldn't actually move.


### Requirements

- [Synchronet](http://www.synchro.net) [BBS software](http://cvs.synchro.net/cgi-bin/viewcvs.cgi/)
- Synchronet's JSON database featured must be enabled.

### Installation

See the `readme.txt` file.

### Acknowledgments

This game is adapted from [saming's implementation of "2048"](https://github.com/saming/2048) with lots of new Synchronet-specific code. I later added tile-movement logic I adapted from [mevdschee's "2048.c"](https://github.com/mevdschee/2048.c)
