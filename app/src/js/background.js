const imgs = [
    "https://thumbs.gfycat.com/AcrobaticInstructiveCygnet-size_restricted.gif",
    "https://64.media.tumblr.com/7c915db7fe1381862fc7a1810da8a792/tumblr_ow34hfiulB1sa9pj8o4_400.gif",
    "https://i.pinimg.com/originals/58/d1/6c/58d16c1b48cb1e69efe02d4f6682feb2.gif",
    "https://media.tenor.com/3txaTuJQHdsAAAAC/ramen-boiling.gif",
    "https://i.gifer.com/PyKs.gif",
    "https://gif.fmkorea.com/files/attach/new/20170622/486616/412183146/690054471/b6240026751de031f737c57b56b7a1ac.gif",
    "https://gi.esmplus.com/taehwa0515/Uni_Black_Bean_Noodles/gif/uni-blackbean-noodle_gif_3.gif",
    "https://media0.giphy.com/media/3ofSBdhOiC9TeW4Tle/giphy.gif?cid=ecf05e47hnmjoigr7fpjx9qgoq04cehpxzdrj9lsiebw259p&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media0.giphy.com/media/26mfi9ZB5iGTzFT2w/giphy.gif?cid=ecf05e47hnmjoigr7fpjx9qgoq04cehpxzdrj9lsiebw259p&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media2.giphy.com/media/3ofSBgewNCmBlKd5wk/giphy.gif?cid=ecf05e47hnmjoigr7fpjx9qgoq04cehpxzdrj9lsiebw259p&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media.tenor.com/8FqNa5K8y9UAAAAC/nongshim-boss-noodles.gif",
    "https://media.tenor.com/8FqNa5K8y9UAAAAC/nongshim-boss-noodles.gif",
    "https://media.tenor.com/8FqNa5K8y9UAAAAC/nongshim-boss-noodles.gif",
]

imgs.forEach((value, index) => {
    const bg = document.createElement('div');
    bg.className = 'bg';
    bg.id = `background${index}`;
    bg.style.backgroundImage = `url(${value})`;
    bg.style.opacity = '0';
    document.body.appendChild(bg);
});

let idx = Math.floor(Math.random() * imgs.length);

setTimeout(() => {
    document.getElementById(`background${idx}`).animate([
        {
            opacity: 0,
        }, {
            opacity: 1
        }
    ], {
        duration: 3000,
        fill: "forwards"
    });
    setInterval(() => {
        document.getElementById(`background${idx}`).animate([
            {
                opacity: 1,
            }, {
                opacity: 0
            }
        ], {
            duration: 2500,
            fill: "forwards"
        });
        let i;
        do {
            i = Math.floor(Math.random() * imgs.length);
        } while (i == idx);
        idx = i;
        document.getElementById(`background${idx}`).animate([
            {
                opacity: 0,
            }, {
                opacity: 1
            }
        ], {
            duration: 2500,
            fill: "forwards"
        });
    }, 8000);
}, 5000);

console.log(window.innerHeight)