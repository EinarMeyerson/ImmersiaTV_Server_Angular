var bodyparser = require('body-parser');
var express = require('express');
var _ = require('underscore');
var fs = require('fs');
var exec = require('child_process').exec;
var ps = require('ps-node');
var path = require('path');


module.exports = function(wagner) {
    var videoRoute = express.Router();
    videoRoute.use(bodyparser.json());

    //POST - Insert a new Video in the DB
    videoRoute.post('/addVideo', wagner.invoke(function(Video){
        return function(req, res) {
            console.log('POST - /object');
            console.log(req.body);
            var newVideo = new Video({
                Name: req.body.Name,
                Type: req.body.Type,
                Size: req.body.Size
            });

            newVideo.save(function (err) {
                if (!err) {
                    res.send(200, "Okey");
                } else {
                    console.log(err);
                    if (err.name == 'ValidationError') {
                        res.send(400, 'Validation error');
                    } else {
                        res.send(500, 'Server error');
                    }
                }
            });
        }
    }));

    //Returns if a file is .acc (Audio) or .h264 (Video)
    function filetype(file_id) {
        var str = file_id.toString();
        var res = str.split(".");
        return res[res.length -1]
    }

    function icon(file_ext){
        if (file_ext.localeCompare("aac") == 0){

            return 'jstree-custom-file-audio'
        }

        else if (file_ext.localeCompare("h264") == 0){
            return 'jstree-custom-file-video'
        }
        else {
            return 'jstree-custom-file'
        }
    }


    //returns the path of the file with the "\" changed with "/" so the server understands it
    function path_format_change(path) {
        var str = path.toString();
        var res = str.split("\\");
        var text ="";
        for(var i = 0; i<res.length; i++){
            if (i==res.length-1){
                text = text + res[i];
            }
            else{
                text = text + res[i] + "/";
            }
        }
        return text
    }

    //Return the GStreamer function depending on the file extension
    function gstreamer_type(file_ext, file, index){

       if (file_ext.localeCompare("aac") == 0){
           var text =  "multifilesrc location="+ path_format_change(file) +" loop=1 ! aacparse ! rtpmp4apay name=pay"+index+" pt=96 ";
           return text
       }

        else if (file_ext.localeCompare("h264") == 0){
           var text = "multifilesrc loop=1 location="+ path_format_change(file) +" ! h264parse ! rtph264pay config-interval=1 name=pay"+index+" ";
           return text
       }
    }

    //POST - Start the server creating .bat with the GStreamer script
    videoRoute.post('/play', function(req, res) {

        console.log("Entramos en PLAAAAY");

        var server = "C:/Users/i2cat/WebstormProjects/ImmersiaTV_Server_Angular/GStreamer/gst-rtsp-server-win32_64.exe";

        /*fs.writeFileSync("C:/Users/i2cat/WebstormProjects/ImmersiaTV_Server_Angular/Server_Scripts/prueba.bat", "@echo off");
        fs.appendFileSync("C:/Users/i2cat/WebstormProjects/ImmersiaTV_Server_Angular/Server_Scripts/prueba.bat", "\n"+"set GST_DEBUG=2, *rtsp*:5"+"\n"+"CALL "+server+" \"( ");
        for(var i=0; i < req.body.length; i++){
            var ft = filetype(req.body[i].id);
            console.log(path_format_change(req.body[i].id));
            var file = gstreamer_type(ft, req.body[i].id, i);
            fs.appendFileSync("C:/Users/i2cat/WebstormProjects/ImmersiaTV_Server_Angular/Server_Scripts/prueba.bat", file);
        }
        fs.appendFileSync("C:/Users/i2cat/WebstormProjects/ImmersiaTV_Server_Angular/Server_Scripts/prueba.bat", ")\"");
        var proc = exec('start C:/Users/i2cat/WebstormProjects/ImmersiaTV_Server_Angular/Server_Scripts/prueba.bat',[options]);*/

        res.send(200, "Okey");
        var text =   server+" \"( ";
        for(var iX=0; iX < req.body.length; iX++){
            var ftX = filetype(req.body[iX].id);
            var fileX = gstreamer_type(ftX, req.body[iX].id, iX);
            text = text + fileX;
        }
        text = text + ")\"";
        exec(text,[{shell:"cmd.exe", killSignal:"serverplay"}]);




    });

    videoRoute.post('/stop', function(req, res){

        //salta error porque nombre no es PID ?¿?¿?¿? PERO FUNCIONA
        ps.kill('gst-rtsp-server-win32_64.exe', function( err ) {
            if (err) {
                throw new Error( err );
            }
            else {
                res.send(200, "Okey");
                console.log( 'Process gstreamer has been killed!');
            }
        });

    });

    /* Serve the Tree */
    videoRoute.get('/api/tree', function(req, res) {
        var _p;
        console.log("Entramos en GEEEEEEET");

        if (req.query.id == 1) {
            _p = path.resolve('..', '..', '..','/data/ftp');
            processReq(_p, res);

        } else {
            if (req.query.id) {
                _p = req.query.id;
                processReq(_p, res);
            } else {
                res.json(['No valid data found']);
            }
        }
    });

    /* Serve a Resource */
    videoRoute.get('/api/resource', function(req, res) {
        res.send(fs.readFileSync(req.query.resource, 'UTF-8'));
    });

    function processReq(_p, res) {
        var resp = [];
        fs.readdir(_p, function(err, list) {
            for (var i = list.length - 1; i >= 0; i--) {
                resp.push(processNode(_p, list[i]));
            }
            res.json(resp);
        });
    }

    function processNode(_p, f) {
        var s = fs.statSync(path.join(_p, f));
        return {
            "id": path.join(_p, f),
            "text": f,
            "icon" : s.isDirectory() ? 'jstree-custom-folder' : icon(filetype(path.join(path.resolve(__dirname, '..', 'Archivos_ImmersiaTV'), f))),
            "state": {
                "opened": false,
                "disabled": false,
                "selected": false
            },
            "li_attr": {
                "base": path.join(_p, f),
                "isLeaf": !s.isDirectory()
            },
            "children": s.isDirectory(),
        };
    }

    return videoRoute;
};