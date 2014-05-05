var wolfLeader = {
  wolves: {
    any: [] // event type: wolf
  },
  addToPack: function (fn, type) {
    type = type || 'any';
    if (typeof this.wolves[type] === "undefined") {
      this.wolves[type] = [];
    }
    this.wolves[type].push(fn);
  },
  removeFromPack: function (fn, type) {
    this.visitWolves('removeFromPack', fn, type);
  },
  sendMessage: function (message, type) {
    this.visitWolves('sendMessage', message, type);
  },
  visitWolves: function (action, arg, type) {
    var messageType = type || 'any',
        wolves = this.wolves[messageType],
        i,
        max = wolves.length;

    for (i = 0; i < max; i += 1) {
      if (action === 'sendMessage') {
        wolves[i](arg);
    } else {
        if (wolves[i] === arg) {
          wolves.splice(i, 1);
        }
      }
    }
  }
};

function makeLeader(o) {
  var i;
  for (i in wolfLeader) {
    if (wolfLeader.hasOwnProperty(i) && typeof wolfLeader[i] === "function") {
      o[i] = wolfLeader[i];
    }
  }
  o.wolves = {any: []};
}

var packLeader = {
  stalk: function (target) {
    this.sendMessage("stalk the " + target);
  },
  backAway: function () {
    this.sendMessage("back away from the leader");
  },
  runAway: function () {
    this.sendMessage("run away!");
  },
  kill: function (target) {
    this.sendMessage("kill the " + target);
  }
};

var wolves = [];
function makeWolves(max) {
  var i;
  for (i = 0; i < max; i+= 1) {
    var id = i
    wolves.push({
      listener: function (id, packLeader) {
        return function (packLeader) {
          console.log("I am wolf #" + id + ", I should " + packLeader);
        }
      }(id)
    });
  }
}

makeWolves(4);
makeLeader(packLeader);
console.log("Wolves created: " + wolves.length);
packLeader.addToPack(wolves[1].listener);
packLeader.addToPack(wolves[2].listener);
console.log("Wolves in the pack: " + packLeader.wolves.any);

packLeader.stalk("poor peasant fellow");
packLeader.stalk("woman near the tree");
packLeader.backAway();
packLeader.runAway();
packLeader.kill("peasant");

phantom.exit();
