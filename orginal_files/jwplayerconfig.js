var App = App || {};
App.Player = (function ($, jw) {
    var baseConfig = {
        Element: 'player',
        Type: 'video', // video, audio, live, file
        image: '',
        File: '',
        Categoryid: '',
        Subcategoryid: '',
        Channelid: 'Visir',
        Categoryname: '',
        Tags: '',
        ShowAds: true,
        PreRollZone: 135,
        PostRollZone: 136,
        LinearAdZone: 137,
        SourceVariable: '',
        FileId: '',
        Host: 'vod.visir.is',
        AutoStart: false,
        useRtmp: false,
        Embed: false,
        Logo: false,
        Subtitles: '',
        Sharing: true,
        AspectRatio: '16:9',
        GeoBlock: false,
        Title: '',
        Description: '',
        RelatedOnclick: 'link',
        Mute: false,
        Dvr: false,
        OverlayVisible: false
    },
	Init = function (cfg) {
	    var _this = this;
	    _this.config = $.extend({}, baseConfig, cfg);

	    var playerConfig = {
	        image: _this.config.image,
	        width: '100%',
	        aspectratio: _this.config.AspectRatio,
	        androidhls: true,
	        skin: 'visir',
	        abouttext: 'V\u00EDsir spilari',
	        aboutlink: 'https://www.visir.is',
	        autostart: _this.config.AutoStart,
	        mute: _this.config.Mute,
	        startparam: 'starttime',
	        preload: 'none',
	        displaytitle: true,
	        displaydescription: false,
	        title: _this.config.Title,
	        description: _this.config.Description,
	        mediaid: _this.config.Mediaid,
	        ga: {}
        };
        var tagsArr = _this.config.Tags.split(',');
        var tagsFormatted = tagsArr.join("\",\"");
        var adKeyValueString = '[{"mediacategory":["' + _this.config.Categoryname + '"]},{"mediachannel":["' + _this.config.Channelid.toLowerCase() + '"]},{"mediaTags":["' + tagsFormatted + '"]}]';
		if (App.Local === true) {
	        playerConfig.skin = 'visir';
	    }
        var relatedlink = '/api/media-related/' + _this.config.Categoryid + '/' + _this.config.Type + '/' + _this.config.FileId;
        if (_this.config.ShowAds === true) {
            let urlString = encodeURIComponent(adKeyValueString).replace(/'/g, "%27").replace(/"/g, "%22") + '&tt=vast3';
	        playerConfig.advertising = {
	            client: 'vast',
	            'skipoffset': 5,
	            'skipmessage': '\u00C1fram xx',
	            'skiptext': '\u00C1fram ',
	            'admessage': 'Augl\u00FDsing endar eftir xx',
	            'schedule': {
	                adbreak1: {
	                    offset: 'pre',
                        tag: 'https://delivery.adnuntius.com/i?auId=00000000000b8605&kv=' + urlString
	                },
	                overlay: {
	                    offset: '10',
                        tag: 'https://delivery.adnuntius.com/i?auId=00000000000bf1c3&kv=' + urlString,
	                    type: 'nonlinear'
	                }
	            }
	        };
	    }
        if (_this.config.Type !== 'live' && _this.config.Type !== 'file' && _this.config.Sharing !== false) {
            playerConfig.related = {
	            file: relatedlink,
	            onclick: _this.config.RelatedOnclick,
                oncomplete: 'autoplay'
	        };
	    }
	    if (_this.config.Type != 'live') {
	        playerConfig.file = 'https://' + _this.config.Host + _this.config.File;
	        playerConfig.primary = 'html5';
	    
            playerConfig.related.heading = 'Tengdar klippur';
            playerConfig.related.autoplaymessage = 'N\u00E6st';
	    }
	        playerConfig.sharing = {
	            link: 'https://www.visir.is/k/' + _this.config.FileId,
	            heading: 'Deila'
	        };

	    if (_this.config.Type == 'live') {
	        playerConfig.file = 'https://' + _this.config.Host + '/hls-live' + ((_this.config.GeoBlock === true) ? '-geo/' : '/') + _this.config.File + '/playlist.m3u8' + ((_this.config.Dvr === true) ? '?DVR' : '');
	    }
	    if (_this.config.Embed === true && _this.config.Type != 'live') {
	        playerConfig.sharing.code = encodeURI('<iframe width="752" height="423" src="https://www.visir.is/player/' + _this.config.FileId + '" frameborder="0" scrolling="no" seamless="seamless" allowfullscreen></iframe>');
	    }
	    if (_this.config.Subtitles !== '') {
	        playerConfig.captions = { backgroundOpacity: 65 };
	        playerConfig.tracks = [{
	            file: _this.config.Subtitles,
	            label: "English",
	            kind: "captions",
	            "default": true
	        }];
	    }

	    playerConfig.localization = {
	        airplay: 'Senda',
	        audioTracks: 'Hljóðklippur',
	        buffer: 'Hleð',
	        cc: 'Texti',
	        close: 'Loka',
	        copied: 'Afritað',
	        fullscreen: 'Fylla skjá',
	        hd: 'Upplausn',
	        liveBroadcast: 'Beint',
	        loadingAd: 'Hleð auglýsingu',
	        more: 'Meira',
	        next: 'Áfram',
	        nextUp: 'Næst',
	        nextUpClose: 'Loka',
	        pause: 'Pása',
	        play: 'Spila',
	        playback: 'Spila',
	        playbackRates: 'Hraði',
	        player: 'Spilari',
	        playlist: 'Listi',
	        prev: 'Til baka',
	        related: 'Meira',
	        replay: 'Spila aftur',
	        rewind: '10s til baka',
	        stop: 'Stoppa',
	        videoInfo: 'Nánar',
	        volume: 'Hljóð',
	        settings: 'Stillingar'
	    }
        var customConf = {
            Type: _this.config.Type,
            Categoryid: _this.config.Categoryid,
            Channelid: _this.config.Channelid,
            FileId: _this.config.FileId
        };

        jw(_this.config.Element).setup(playerConfig).on('play', function () {
            if (customConf.Type === 'video' || customConf.Type === 'audio') {
                if (self.fetch) {
                    fetch('/api/mping', {
                        headers: {
                            'X-VCSM': customConf.FileId + "|" + customConf.Categoryid + "|" + customConf.Type + "|" + customConf.Channelid
                        }
                    });
                } else {
                    $.get({
                        url: '/api/mping',
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('X-VCSM', customConf.FileId + "|" + customConf.Categoryid + "|" + customConf.Type + "|" + customConf.Channelid);
                        }
                    });
                }
            };
        });
        if (window.location.hash) {
            var offset = window.location.hash.substr(3);
            jw(_this.config.Element).seek(offset);
        }
	    jw(_this.config.Element).on('adImpression',
			function (d) {
			    _this.config.OverlayVisible = true;
			    $('#' + _this.config.Element + '_vast img').not('.jw-banner').click(function () { _this.config.OverlayVisible = false; });
			    if (d.creativetype == 'static') {
			        setTimeout(function () {
			            if (_this.config.OverlayVisible !== false) {
			                $('#' + _this.config.Element + '_vast img').not('.jw-banner').click();
			                _this.config.OverlayVisible = false;
			            }
			        }, 30000);
			    }
			});       

	    jw(_this.config.Element).on('error', function (error) {
	        if (/403/.test(error.messge)) {
	            $(_this.config.Element).html('<h2 class="jw-geoblocked"><i class="geo-logo"></i>Þetta myndband er aðeins aðgengilegt á Íslandi<h2>');
	        }
	    });
	};

    return {
        Init: (function () {
            return function (cfg) {
                Init.call(this, cfg);
            };
        })()
    };
})(jQuery, jwplayer);
