// 随机选歌：同一会话内不重复，全部听完后重新开始一轮
var SongPicker = (function () {
    var KEY = 'lumi-played-songs';

    function getPlayed() {
        try {
            return JSON.parse(sessionStorage.getItem(KEY)) || [];
        } catch (e) {
            return [];
        }
    }

    function setPlayed(ids) {
        try {
            sessionStorage.setItem(KEY, JSON.stringify(ids));
        } catch (e) {}
    }

    function markPlayed(id) {
        var played = getPlayed();
        if (played.indexOf(String(id)) === -1) {
            played.push(String(id));
            setPlayed(played);
        }
    }

    // currentId: 当前正在播放的歌，新一轮时也不会立刻抽到它
    function pick(songs, currentId) {
        if (!songs || songs.length === 0) return null;
        var played = getPlayed();
        var pool = songs.filter(function (s) {
            return played.indexOf(String(s.id)) === -1;
        });
        if (pool.length === 0) {
            played = currentId != null ? [String(currentId)] : [];
            setPlayed(played);
            pool = songs.filter(function (s) {
                return played.indexOf(String(s.id)) === -1;
            });
            if (pool.length === 0) pool = songs;
        }
        return pool[Math.floor(Math.random() * pool.length)];
    }

    return { pick: pick, markPlayed: markPlayed };
})();
