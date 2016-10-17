var messages = []
function Shell(opts){
    self.max_rows = opts && opts.max_rows ? opts.max_rows : '8';
    self.ready = false;


    return {show: function(message){
        var left_messages = ['Live Demo:']

        var texts = []
        
        for(var i = 0; i < messages.length; i++){
            texts.push(messages[i].message)
        }

        if(message && texts.indexOf(message.message) < 0){
            messages.push(message)
        }
        if(messages.length > 12){
            messages.shift()
        }
        if(self.ready){
            var window_width = window.innerWidth
            var left_margin = window_width /5
            var logsvg = d3.select("#logs")

            var titles = logsvg.selectAll('text.title').data(left_messages)

            titles.enter()
            .append('text')
            .attr('fill', 'red')        
            .attr('class', 'title')
            .attr('font-family', 'Share Tech Mono')
            .attr('font-size', '13px')
            .attr('x', function(d,i){
                return left_margin-40;
            })
            .attr('y', function(d,i){
                return 300;
            })
            .text(function(d,i){
                return d
            })
            .transition()
            .attr('y', function(d,i){
                return 20 + i*15;
            })
            .attr('fill', function(d, i){
            if(d.color){
                return d.color
            } else {
                return 'white';
            }
            })
            titles           
            .transition()
            .delay(function(d,i){
                return i * 100;
            })
            .attr('y', function(d,i){
                return 20 + i*15;
            })
            .attr('x', function(d,i){
                return left_margin-40;
            })
            .attr('fill', function(d, i){
                if(d.color){
                return d.color
                } else {
                return 'white';
                }
            })

            var logged = logsvg.selectAll('text.logs').data(messages, function(d,i){
                if(d){
                    return d.message
                } else {
                    return new Date()
                }
            })

            logged
            .transition()
                        .delay(function(d,i){
                    return i * 100;
                })
            .attr('y', function(d,i){
                return 20 + i*15;
            })
            .attr('x', function(d,i){
                return left_margin+40;
            })
            .attr('fill', function(d, i){
                if(d.color){
                return d.color
                } else {
                return 'white';
                }
            })

            logged.enter()
                .append('text')
                .attr('fill', 'grey')        
                .attr('class', 'logs')
                .attr('font-family', 'Share Tech Mono')
                .attr('font-size', '13px')
                .attr('x', function(d,i){
                return left_margin+40;
                })
                .attr('y', function(d,i){
                return 300;
                })
                .text(function(d,i){
                return d.message
                })
                .transition()
                .delay(function(d,i){
                    return i * 100;
                })
                .attr('y', function(d,i){
                return 20 + i*15;
                })
                .attr('fill', function(d, i){
                if(d.color){
                    return d.color
                } else {
                    return 'white';
                }
                })

            logged.exit()
            .transition()
                .attr('y', function(d,i){
                return -20;
                })
                .attr('fill', '#04182b')
                .remove()
            d3.select(window)
                .on("resize", function() {
                    //shell()
                });
        }
        
    },
    draw: function(){
        self.ready = true;
    },
    clear: function(){
        messages = []
    }
    }
 
}
document.Shell = Shell