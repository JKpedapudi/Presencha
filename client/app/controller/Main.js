Ext.define('Presencha.controller.Main', {
    extend: 'Ext.app.Controller',
    
    views: ['Slideshow', 'PresoForm', 'FileUploadField', 'SlideshowSummary'],
    models: ['Slide', 'Slideshow'],
    stores: ['Slideshow'],
    refs: [
        {
            ref: 'slideShow',
            selector: '#slideShow'
        },
        {
            ref: 'presoForm',
            selector: 'presoform'
        },
        {
            ref: 'htmlform',
            selector: '#htmlFormPanel'
        },
        {
            ref: 'viewport',
            selector: 'viewport'
        },
        {
            ref: 'slideshowsummary',
            selector: 'slideshowsummary'
        }
    ],
    
    launch: function() {
      // TODO: Use routing to determine the API call we need to make
      // Set the proxy url of our slideshow store to this
        
        this.control({
          'slideshow' : {
              // Handlers here.. select: this.showSlides, 
          },
          '#presentationUploadButton': {
              // Form submission handler goes here
              tap: this.onUploadTap
          }
        });
        
        
        /* Retrieve the query string from the URL - looks something like /?key=abc&secretkey=def */
        var queryString = Ext.urlDecode(window.location.search.substring(1));
        
        if (queryString.key){
          var key = queryString.key; // todo: Error check
          key = key.replace("/",""); // trailing slash is included when we urlDecode
          var url = "http://api.presencha.com/slideshow/" + queryString.key;
        }else{
          Ext.Msg.alert('No Slideshow Key', 'Please provide a slideshow key'); // TODO: right now if we hit root, this is fired. Need to instead show upload box & recents list
        }
        
        
        
        if(queryString.secretKey){
          var secretKey = queryString.secretKey;
          secretKey = secretKey.replace("/", ""); // trailing slash is included when we urlDecode
        	PresenchaMsg.isPresenter = true;
        }

        var slideStore = this.getSlideshowStore();
        
        /* Change the proxy of our store to have the correct URL. */
        var newProxy = {
          type: 'ajax',
          url: 'http://api.presencha.com/slideshow/' + key
       }
        slideStore.setProxy(newProxy);
        
        
        slideStore.on({
          'load': this.addSlides,
          scope: this
        });
        
        slideStore.load();
        
        var vp = this.getViewport();
        
        window.onkeydown = this.keyboardEvent;
        
        
    },
    
    showSlides: function(){
        // handler functions here var list = this.getSlideList();
    },
    
    onUploadTap: function() {
        Ext.Ajax.request({
            url: 'http://api.presencha.com/slideshow',
            isUpload: true,
            method: 'POST',
            scope: this,
            params: this.getPresoForm().down('formpanel').getValues(),
            success: function() {
                var vp = this.getViewport();
                
                vp.add({ xtype: 'slideshowsummary' });
                this.getViewport().setActiveItem(1);
                
            },
            failure: function() {
                debugger;
                console.log('Upload failed.')
            }
        })
    },

    addSlides: function(data, p2){
      var car = this.getSlideShow();
      if (!p2) return;
      var record = p2[0];
      
      var slides = record.get('slides');
      var title = record.get('title');
      
      for (var i=0; i<slides.length; i++){
        slides[i].html = '<img src="' + PresenchaMsg.getSlideUrl('http://api.presencha.com' + slides[i].url) + '">'; 
        slides[i].xtype = 'container';
      }
    //  debugger;
     
    car.setItems(slides);
    
    if(PresenchaMsg.isPresenter) {
    PresenchaMsg.startSlideshow('test');
    }
    else {
    	PresenchaMsg.joinSlideshow('test', function(from, message) {
    	   var c = PresenchaMsg.carousel;
       	c.setActiveItem(message.slideNumber-1);
   	});
    }
  
    },
    keyboardEvent: function(ev){
      //TODO: How to get the carousel view in scope here? Curry?
      var code = ev.keyCode;
      switch (code) {
        case 37: // left
          // go back a slide
          break;
        case 38: // up
          //go forward a slide
          break;
        case 39: // right
          // go forward a slide
          break;
        case 40: // down
          // go back a slide
          break;
      }


    }

});

