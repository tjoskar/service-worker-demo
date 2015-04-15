/**
 * Generate a random integer between
 * lower and uper
 * @param {integer} lower
 * @param {integer} uper
 * @return {integer}
 */
var randomInt = function(lower, uper) {
    return Math.floor((Math.random() * (Math.abs(uper) + Math.abs(lower))) - Math.abs(lower) + 1);
};

/**
 * Generate random date
 * @return {!Date}
 */
var randomDate = function() {
    var now = new Date();
    var past = now.getTime() + (randomInt(-3, 14) * 86400000);
    now.setTime(past);
    return now;
};

/**
 * Return a random value from an array
 * @param {Array} a
 * @return {mixed}
 */
var randomValueFromArray = function(a) {
    return a[Math.floor(Math.random() * a.length)];
};

var faker = {
    data: {
        episodeTitles: [
            'Pretty Much Dead Already',
            'The End',
            'You Win or You Die',
            'To the Future!',
            'Goodbye, Michael',
            'Winter Is Coming',
            'Surprise, Motherfucker!',
            'The Dark... Whatever',
            'I am the one who knocks',
            'This Is the Way the World Ends'
        ],
        showTitles: [
            'Game of Thrones',
            'The Walking Dead',
            'Dexter',
            'Breaking Bad',
            'Lost'
        ],
        fanarts: [
            'http://img.episodehunter.tv/serie/fanart/504242b7ca765.jpg', // TWD
            'http://img.episodehunter.tv/serie/fanart/504241d8bbe1d-1.jpg', // GOT
            'http://img.episodehunter.tv/serie/fanart/504241a3587b9-1.jpg', // Dexter
            'http://img.episodehunter.tv/serie/fanart/504241832a7d3.jpg', // BB
            'http://img.episodehunter.tv/serie/fanart/5042421e66688.jpg' // Lost
        ]
    },

    episodeId: function() {
        return randomInt(50, 1000);
    },

    showId: function() {
        return randomInt(1, 100);
    },

    season: function() {
        return randomInt(1, 5);
    },

    episode: function() {
        return randomInt(1, 10);
    },

    airs: function() {
        return randomDate().toISOString();
    },

    year: function() {
        return randomInt(2000, 2015);
    },

    episodeTitle: function() {
        return randomValueFromArray(faker.data.episodeTitles);
    },

    showTitle: function() {
        return randomValueFromArray(faker.data.showTitles);
    },

    fanart: function() {
        return randomValueFromArray(faker.data.fanarts);
    }

};

var upcomingStatic = {
    "episodes": [
        {
            "ids": {
                "id": null
            },
            "title": null,
            "season": null,
            "episode": null,
            "airs": null,
            "show": {
                "ids": {
                    "id": 1872
                },
                "title": "Fargo",
                "poster": "534e0bfb6dc01.jpg",
                "fanart": "534e0bfa0ba3d.png"
            }
        },
        {
            "ids": {
                "id": null
            },
            "title": null,
            "season": null,
            "episode": null,
            "airs": null,
            "show": {
                "ids": {
                    "id": 2850
                },
                "title": "Marco Polo (2014)",
                "poster": "548c9869f08f7.jpg",
                "fanart": "548c9869eb7d1.png"
            }
        },
        {
            "ids": {
                "id": null
            },
            "title": null,
            "season": null,
            "episode": null,
            "airs": null,
            "show": {
                "ids": {
                    "id": 108
                },
                "title": "Banshee",
                "poster": "50e1526b8fa07.jpg",
                "fanart": "50e1526c80642.png"
            }
        },
        {
            "ids": {
                "id": null
            },
            "title": null,
            "season": null,
            "episode": null,
            "airs": null,
            "show": {
                "ids": {
                    "id": 1246
                },
                "title": "Helix",
                "poster": "52c83e12a258f.jpg",
                "fanart": "52c83e1262557.png"
            }
        },
        {
            "ids": {
                "id": null
            },
            "title": null,
            "season": null,
            "episode": null,
            "airs": null,
            "show": {
                "ids": {
                    "id": 2188
                },
                "title": "The Leftovers",
                "poster": "53a9c1537f466.jpg",
                "fanart": "53a9c152cdf93.png"
            }
        },
        {
            "ids": {
                "id": null
            },
            "title": null,
            "season": null,
            "episode": null,
            "airs": null,
            "show": {
                "ids": {
                    "id": 88
                },
                "title": "Sherlock",
                "poster": "50b220731c0b4.jpg",
                "fanart": "50b22073538d6.png"
            }
        },
        {
            "ids": {
                "id": null
            },
            "title": null,
            "season": null,
            "episode": null,
            "airs": null,
            "show": {
                "ids": {
                    "id": 1166
                },
                "title": "True Detective",
                "poster": "52b1b87280ffd.jpg",
                "fanart": "52b1b8724aa92.png"
            }
        },
        {
            "ids": {
                "id": null
            },
            "title": null,
            "season": null,
            "episode": null,
            "airs": null,
            "show": {
                "ids": {
                    "id": 12
                },
                "title": "Hell on Wheels",
                "poster": "504241dd5199c.jpg",
                "fanart": "504241ddb05a1.png"
            }
        },
        {
            "ids": {
                "id": null
            },
            "title": null,
            "season": null,
            "episode": null,
            "airs": null,
            "show": {
                "ids": {
                    "id": 2064
                },
                "title": "Halt and Catch Fire",
                "poster": "53814ea3908eb.jpg",
                "fanart": "53814ea2c7bad.png"
            }
        },
        {
            "ids": {
                "id": null
            },
            "title": null,
            "season": null,
            "episode": null,
            "airs": null,
            "show": {
                "ids": {
                    "id": 74
                },
                "title": "Homeland",
                "poster": "50b21fde1c798.jpg",
                "fanart": "50b21fdebd663.png"
            }
        },
        {
            "ids": {
                "id": null
            },
            "title": null,
            "season": null,
            "episode": null,
            "airs": null,
            "show": {
                "ids": {
                    "id": 703
                },
                "title": "Black Sails",
                "poster": "525b1c9cf2968.jpg",
                "fanart": "525b1c9d44edf.png"
            }
        },
        {
            "ids": {
                "id": null
            },
            "title": null,
            "season": null,
            "episode": null,
            "airs": null,
            "show": {
                "ids": {
                    "id": 52
                },
                "title": "Solsidan",
                "poster": "5060d41e064a5.jpg",
                "fanart": "5060d41ee3959.png"
            }
        },
        {
            "ids": {
                "id": null
            },
            "title": null,
            "season": null,
            "episode": null,
            "airs": null,
            "show": {
                "ids": {
                    "id": 159
                },
                "title": "Ray Donovan",
                "poster": "51aba65035752.jpg",
                "fanart": "259866-5.png"
            }
        },
        {
            "ids": {
                "id": null
            },
            "title": null,
            "season": null,
            "episode": null,
            "airs": null,
            "show": {
                "ids": {
                    "id": 2034
                },
                "title": "The Strain",
                "poster": "53764b1acc3b4.jpg",
                "fanart": "53764b1aaabe3.png"
            }
        },
        {
            "ids": {
                "id": null
            },
            "title": null,
            "season": null,
            "episode": null,
            "airs": null,
            "show": {
                "ids": {
                    "id": 24
                },
                "title": "The Walking Dead",
                "poster": "504242b726b5d.jpg",
                "fanart": "504242b7ca765.png"
            }
        },
        {
            "ids": {
                "id": 233048
            },
            "title": "Breaking Point",
            "season": 3,
            "episode": 9,
            "airs": "2015-04-16",
            "show": {
                "ids": {
                    "id": 144
                },
                "title": "Vikings",
                "poster": "512ae1dfd1ecc.jpg",
                "fanart": "512ae1e0c63e0.png"
            }
        },
        {
            "ids": {
                "id": 234475
            },
            "title": "The House of Black and White",
            "season": 5,
            "episode": 2,
            "airs": "2015-04-16",
            "show": {
                "ids": {
                    "id": 10
                },
                "title": "Game of Thrones",
                "poster": "504241d7e6a13-2.jpg",
                "fanart": "504241d8bbe1d-1.png"
            }
        },
        {
            "ids": {
                "id": 237229
            },
            "title": "The Communication Deterioration",
            "season": 8,
            "episode": 21,
            "airs": "2015-04-16",
            "show": {
                "ids": {
                    "id": 20
                },
                "title": "The Big Bang Theory",
                "poster": "50424242ce7ae.jpg",
                "fanart": "5042424330b51.png"
            }
        },
        {
            "ids": {
                "id": 234683
            },
            "title": "Under the Knife",
            "season": 1,
            "episode": 20,
            "airs": "2015-04-20",
            "show": {
                "ids": {
                    "id": 2051
                },
                "title": "Gotham",
                "poster": "537ba50415891.jpg",
                "fanart": "537ba503d6ce4.png"
            }
        },
        {
            "ids": {
                "id": 237769
            },
            "title": "Fighting Irish",
            "season": 13,
            "episode": 15,
            "airs": "2015-04-19",
            "show": {
                "ids": {
                    "id": 8
                },
                "title": "Family Guy",
                "poster": "504241ce27d6b.jpg",
                "fanart": "504241ce81356.png"
            }
        },
        {
            "ids": {
                "id": 237928
            },
            "title": "TBA",
            "season": 4,
            "episode": 1,
            "airs": "2015-07-26",
            "show": {
                "ids": {
                    "id": 5
                },
                "title": "Continuum",
                "poster": "5042419505b92.jpg",
                "fanart": "504241956e53f.png"
            }
        }
    ]
};

/**
 * Generate n number of upcoming episodes
 * @param  {integer} n
 * @return {object}
 */
module.exports = function(n) {

    // Return static data
    return upcomingStatic;

    // Or if you want to return dynamic (change for every request)
    // var upcoming = [];
    // for (var i = 0; i < n; i++) {
    //     upcoming.push({
    //         ids: {
    //             id: faker.episodeId(),
    //             show: faker.showId()
    //         },
    //         title: faker.episodeTitle(),
    //         season: faker.season(),
    //         episode: faker.episode(),
    //         airs: randomDate().toISOString(),
    //         thumbnail: 'something.jpg',
    //         show: {
    //             ids: {
    //                 id: faker.showId()
    //             },
    //             title: faker.showTitle(),
    //             year: faker.year(),
    //             poster: 'poster.jpg',
    //             fanart: faker.fanart()
    //         }
    //     });
    // }

    // return {
    //     'episodes': upcoming
    // };
};
