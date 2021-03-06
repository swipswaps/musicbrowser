Installation
------------
1) Make sure your web server supports at least PHP 4.2 (PHP 5 works as well)
2) Extract the distribution archive to a web accessible path 
   (e.g. /var/www/musicbrowser)
3) Edit path in index.php to match your site (e.g. /mnt/media/mp3)
4) Enjoy your music collection through a browser 
   (e.g. http://myserver/musicbrowser)

Installation example (Debian)
-----------------------------
1) $ sudo apt-get install lighttpd php5-cgi
   $ cd /etc/lighttpd/conf-enabled
   $ sudo ln -s ../conf-available/10-fastcgi.conf .
   $ sudo /etc/init.d/lighttpd restart
2) $ unzip musicbrowser.zip
   $ vim musicbrowser/index.php (i to edit, "esc :wq return" to exit)
3) $ cp -R musicbrowser /var/www/
   Music Browser is now available at http://yourhost/musicbrowser/

Local playback on the webserver
-------------------------------
- If your webserver has a soundcard with loudspeakers connected, you should
  be able to use a local player.
- Crude example: set "player" => "killall madplay; /usr/bin/madplay" in
  index.php
- Make sure the web server user (e.g. www-data) has write permission to the
  sound device, e.g. by "sudo chmod a+w /dev/dsp*"

Playback via Slimserver
-----------------------
- Make sure your Slimserver is running
- Use the base URL as slimserverUrl in index.php, e.g.
  'slimserverUrl' => "http://myserver:9000/",
- Navigate to your Slimserver -> Player settings -> Player information. 
  Copy the MAC address or the IP number and paste into slimserverPlayer in
  index.php, e.g. 'slimserverPlayer' => "12:56:AE:1E:12:04",
- Music Browser should support Slimserver playback now.


Troubleshooting
---------------

- I only get a blank screen!
Set 'debug' => true in index.php, you might see some helpful info.
Also look into your web server's error.log.

- Only 130 seconds of my songs are played!
Set max_execution_time = 0 in php.ini.

- I need password controlled access.
Your web server can provide this. Google for ".htaccess" if you are
using Apache, and "auth.backend.plain.userfile" if you are using
Lighttpd.

- Unicode characters (asian etc.) look weird.
Try replacing "iso-8859-1" with "utf-8" in the 'charset' configuration in index.php

- PLS playlists with unicode names (asian etc.) doesn't play in WinAmp.
Somehow WinAmp doesn't like unicode PLS playlist names, I assume it is
a bug. Switch to M3U playlist, WinAmp will read this as it should.
Also, PLS playlists will play just fine when opened in iTunes.

- I get "Could not open URL - Error reaching slimserver" when trying to
  play on Squeezebox.
Try opening the URL from the error message into a new browser window.
You might see that you need to lower your CSRF Protection Level in
SqueezeCenter » Settings » Advanced » Security.


Changelog
---------
0.25
- Made code easier to test
- Added support for browers' native player.  Thanks to David Battino, www.batmosphere.com.

0.24 (2009-05-12)
- Bugfix (#2788788): Non-ascii characters didn't resolve well under Windows
- $thumbSize (size of cover image) available in index.php
- streamlib.php was renamed to musicbrowser.php
- Perform workaround if the Multibyte String Functions extension is missing
- the word_wrap function didn't wrap properly
- Bugfix: IE6 & 7 didn't know how to use string indexes
- CSS template added.  Thanks to Henrie van der Locht for all help with this template.

0.23 (2009-05-04)
- Added a template by Henrie van der Locht.  Look at
  <https://github.com/henrik242/musicbrowser/tree/master/templates/henrie> for details
- Bugfix (#2785523): Url didn't resolve properly in some situations
- Bugfix (#2766482): Search with non-ascii characters on MacOSX is working now, but
  only when PHP 5.3 or the PECL Internationalization extension is installed

0.22 (2009-04-21)
- Bugfix: flash player content was always shuffled
- Bugfix: selecting the root folder wiped flash player playlist in Firefox 3.0.x

0.21 (2009-04-19)
- UI changes: two letters are used in sub headings
- Several source code improvements
- Unicode ajax fixes for Safari
- Use ajax for squeezebox/server/xbmc playback

0.20 (2009-04-13)
- Added search
- Added XSPF playlist support (thanks to Christopher Eykamp)
- Small UI changes

0.19 (2009-04-09)
- Bugfix: ampersands in url hash weren't handled properly
- Bugfix: use CRLF in playlists

0.18 (2009-04-08)
- Improved error and dialog handling
- View enlarged cover image without disturbing playback
- Various small improvements

0.17 (2009-04-07)
- Some code refactoring
- New 'securePath' config variable to allow symlinks that points outside 'path'
- The browser back/forwards buttons now work
- Bugfix: spaces were trimmed from folders in certain situations
- Hosting over https should work better now

0.16 (2008-08-11)
- Added flash player hotkeys: (p)lay/pause, (a)dd all songs, (b)ack, (n)ext
- Fixed a bug in the breadcrumbs when using utf-8
- Fixed a quoting bug when using a permalink with an apostroph
- Renamed swfobject.js to musicbrowser.js

0.15 (2008-07-01)
- Use Ajax for browsing.  Flash player playback is no longer interrupted by
  selecting a different folder.
- File download didn't always work in v0.14

0.14 (2008-04-13)
- Remote control of XBMC Media Center added (http://xbmc.org/)
- Workaround for php versions without utf8_encode() (e.g. fun_plug for DNS-323)
- Improved play and download icons
- NB! Small config change, one enabledPlay entry is used instead of several
  enable* entries.  Please update your index.php file.

0.13 (2008-02-20)
- Added playlist shuffle
- Bugfix: UTF-8 handling in flashplayer and asx playlists would't work for
  some versions of PHP4 in certain situations
- Bugfix: Rss title linked to itself

0.12 (2008-02-12)
- Bugfix: Non-ascii characters wasn't displayed correctly in flashplayer and
  asx playlists
- Bugfix: The root playlist name was empty
- Clean up item naming in playlist and flashplayer
- Bugfix: Redirect (e.g. when using squeezebox playback) didn't work properly
- Bugfix: Flash player only played first song in a playlist

0.11 (2008-02-10)
- Bugfix: flash player support for UTF-8 link names 
- Shows covers for all folders when new config 'folderCovers' is enabled
- New color scheme

0.10 (2008-02-08)
- Bugfix: Download URL's were broken (bug #1889393)
- Improve file name parsing for flash player
- Charset for rss and browser is now specified in index.php
- Don't return everything from the root path if an illegal path is specified

0.9 (2008-02-03)
- Bugfix: Flash player didn't play songs with quotes (bug #1885871)

0.8 (2008-02-03)
- Add embedded audio player (JW FLV Media Player)
- Enable direct file access when possible (makes rwd/fwd work in i.e. WinAmp)
- Add style tag for file and folder items
- Add option to hide files and folders (see hideItems in index.php)

0.7 (2007-12-03)
- Bugfix: slim option wouldn't stick
- Word wrap long song names
- NB! Config update for slimserver, only base url and player id is needed now.
- Bugfix: Empty array in allowLocal blocked everyone

0.6 (2007-11-12)
- Bugfix: podcast/rss didn't work in PHP4.x
- Ability to enable/disable each playlist type in config (asx/pls/m3u)

0.5 (2007-11-11)
- All folders are available as podcasts (aka rss feeds)
- Bugfix: slimserver checkbox didn't work when server playback was disabled
- Use the current directory if config 'path' is empty
- Simplify GET statement
- Enable .asx playlists

0.4 (2007-11-05)
- Rudimentary Slimserver support (http://slimdevices.org/)
- Fix quoting bug when magic_quotes_sybase was enabled
- Fix display error when file names are utf-8 encoded
- Possibility to limit slimserver and server side playback to allowed hosts

0.3 (2007-11-03)
- lower PHP requirement to 4.2
- very basic support for server side playback
- prettier URLs
- move MusicBrowser class from index.php to streamlib.php
- play icon for all folders
- play folders recursively

0.2 (2007-10-23)
- lower PHP requirement to 4.3

0.1 (2007-10-17)
- initial release
- requires PHP 5.1

Contact
-------
Contact me at musicbrowser (at) henrik (dot) synth (dot) no
More info at http://musicbrowser.sf.net/
