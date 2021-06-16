$('document')
    .ready(function() {

        // Creating a new password
        function generate() {

            var length;
            var keys = '';
            var result = '';

            keys += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; 

            var time = window.delta; 
            keys += time; 

            for (var i = 1; i <= 8; i++) {
                var keyPos = Math.round(Math.random() * (keys.length - 1));
                result += keys.charAt(keyPos);
            }

            $('#result')
                .html(result.length > lengthDisplay ? result.substr(0, lengthDisplay - 3) + '...' : result);
            $('#result')
                .attr('title', result);
            $('#resultContainer')
                .html(result);
        }

        // Loads localization strings
        function loadLocalizations() {
            $('#appClose')
                .attr('title', chrome.i18n.getMessage("appClose"))

            $('#tabGenerator')
                .html(chrome.i18n.getMessage("tabGenerator"));

            $('#btnGenerate')
                .html(chrome.i18n.getMessage("btnGenerate"));
            
        };

        // Closes the window 
        $('#appClose')
            .click(function() {
                window.close();
            });

        // If clicked... 
        $('#btnGenerate')
            .click(function() {
                if (!$(this)
                    .hasClass('disabled'))
                    generate();
                return false;
            });
        
        var lengthDisplay = 25;

        loadLocalizations();
    });
