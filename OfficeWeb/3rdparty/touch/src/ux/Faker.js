Ext.define('Ext.ux.Faker', {
    config: {
        names: ['Ed Spencer', 'Tommy Maintz', 'Rob Dougan', 'Jamie Avins', 'Jacky Nguyen'],
        emails: ['ed@sencha.com', 'tommy@sencha.com', 'rob@sencha.com', 'jamie@sencha.com', 'jacky@sencha.com'],
        lorem: [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eget neque nec sem semper cursus. Fusce ",
            "molestie nibh nec ligula gravida et porta enim luctus. Curabitur id accumsan dolor. Vestibulum ultricies ",
            "vehicula erat vel elementum. Mauris urna odio, dignissim sit amet molestie sit amet, sodales vel metus. Ut eu ",
            "volutpat nulla. Morbi ut est sed eros egestas gravida quis eget eros. Proin sit amet massa nunc. Proin congue ",
            "mollis mollis. Morbi sollicitudin nisl at diam placerat eu dignissim magna rutrum.\n",

            "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Phasellus eu ",
            "vestibulum lectus. Fusce a eros metus. Vivamus vel aliquet neque. Ut eu purus ipsum. Nullam id leo hendrerit ",
            "augue imperdiet malesuada ac eget velit. Quisque congue turpis eget ante mollis ut sollicitudin massa dapibus. ",
            "Sed magna dolor, dictum sit amet aliquam eu, ultricies sit amet diam. Fusce tempor porta tellus vitae ",
            "pulvinar. Aenean velit ligula, fermentum non imperdiet et, suscipit sed libero. Aliquam ac ligula ut dui ", 
            "pharetra dictum vel vel nunc. Phasellus semper, ligula id tristique ullamcorper, tortor diam mollis erat, sed ",
            "feugiat nisl nisi sit amet sem. Maecenas nec mi vitae ligula malesuada pellentesque.\n",

            "Quisque diam velit, suscipit sit amet ornare eu, congue sed quam. Integer rhoncus luctus mi, sed pulvinar ",
            "lectus lobortis non. Sed egestas orci nec elit sagittis eu condimentum massa volutpat. Fusce blandit congue ",
            "enim venenatis lacinia. Donec enim sapien, sollicitudin at placerat non, vehicula ut nisi. Aliquam volutpat ",
            "metus sit amet lacus condimentum fermentum. Aliquam congue scelerisque leo ut tristique."
        ].join(""),
        
        subjects: [
            "Order more widgets",
            "You're crazy",
            "Jacky is not his real name",
            "Why am I here?",
            "This is totally broken",
            "When do we ship?",
            "Top Secret",
            "There's always money in the banana stand"
        ]
    },
    
    oneOf: function(set) {
        return set[Math.floor(Math.random() * set.length)];
    },
    
    name: function() {
        return this.oneOf(this.getNames());
    },
    
    email: function() {
        return this.oneOf(this.getSubjects());
    },
    
    subject: function() {
        return this.oneOf(this.getSubjects());
    },
    
    lorem: function(paragraphs) {
        var lorem = this.getLorem();
        
        if (paragraphs) {
            return lorem.split("\n").slice(0, paragraphs).join("\n");
        } else {
            return lorem;
        }
    }
});