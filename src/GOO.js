var Const;
(function (Const) {
    Const.content_selector = $("#frame").contents().find("#content");
    Const.like_facebook = ["#666666", "#141823", "#9197a3", "#3a5795",
        "#ffffff", "#373e4d", "#232937", "#3b5998",
        "#f6f7f8", "#e9eaed", "#333333", "#4e5665",
        "#6bb933", "#7f7f7f", "#89919c", "#627aad",
        "#6a7180", "#355089"];
    Const.like_ebay = ["#333333", "#ffffff", "#0654ba", "#6a29b9",
        "#dddddd", "#767676", "#555555", "#fff7ed",
        "#727272", "#777777"];
    Const.like_reddit = ["#555555", "#cee3f8", "#f0f3fc", "#808080",
        "#ffffff", "#f7f7f7", "#ff4500", "#9a7d2e",
        "#f0f0f0", "#696969", "#554a2a", "#888888",
        "#551a8b", "#fbfaf8", "#336699", "#f5f5f5",
        "#0000ff", "#eff7ff", "#e9f2fc", "#777777",
        "#f8ecb6", "#dddddd", "#dfecf9", "#5a3f1a",
        "#333333", "#a1bcd6", "#c6c6c6", "#a0a0a0",
        "#f3e287"];
    Const.like_bootstrap_3 = ["#e5e5e5", "#ffffff", "#333333", "#767676",
        "#5bc0de", "#cdbfe3", "#f8f8f8", "#6f5499",
        "#d9534f", "#c7ddef", "#fcf8e3", "#8a6d3b",
        "#f9f9f9", "#f7f7f9", "#d9edf7", "#dff0d8",
        "#f5f5f5", "#a94442", "#f2dede", "#777777",
        "#222222", "#5cb85c", "#337ab7", "#f0ad4e",
        "#ce4844", "#555555", "#eeeeee", "#fdfdfd",
        "#31708f", "#999999", "#3c763d", "#563d7c",
        "#d44950", "#2b542c", "#f9f2f4", "#9999ff",
        "#c7254e", "#4f9fcf", "#2f6f9f", "#dddddd",
        "#ff6600"];
    Const.like_amazon = ["#cccccc", "#111111", "#767676", "#999999",
        "#ffffff", "#eeeeee", "#0066c0", "#232f3e",
        "#e7e9ec", "#febd69", "#949494", "#004b91",
        "#444444", "#dddddd", "#f0c14b", "#333333",
        "#f3f3f3", "#e47911", "#555555", "#0055aa",
        "#b12704", "#48a3c6", "#777777", "#f08804",
        "#cc9900"];
    Const.like_google = ["#607d8b", "#5e5e5e", "#009688", "#a2a2a2", "#ffc107", "#cddc39", "#e91e63", "#ffffff", "#828282", "#2196f3", "#f7f7f7", "#dddddd", "#ff9800", "#f32c1e", "#aeaeae", "#8bc34a", "#00bcd4", "#f44336", "#777777", "#f4f4f4", "#a9a9a9", "#9e9e9e", "#333333", "#1ec01e", "#ffa500"];
})(Const || (Const = {}));
var State;
(function (State_1) {
    var content_selector = $("#frame").contents().find("#content");
    var _subscribers = {};
    State_1.State = {
        Datum: {},
        UndoStack: []
    };
    function onContentChange() {
        State_1.State.Datum = Lib.collect_data(content_selector);
        flush_for_undo();
        pub();
    }
    State_1.onContentChange = onContentChange;
    function onImageUploaded(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var imgObj = new Image();
                imgObj.src = e.target["result"];
                var colorThief = new ColorThief();
                import_palette(_.map(colorThief.getPalette(imgObj, _.keys(State_1.State.Datum).length), function (el) {
                    return Lib.parsedRgbToHex(el[0], el[1], el[2]);
                }));
            };
        }
        try {
            reader.readAsDataURL(input.files[0]);
        }
        catch (e) {
            console.log(e);
        }
    }
    State_1.onImageUploaded = onImageUploaded;
    function onColorsChange(color_sign, new_color_sign) {
        Lib.modify_prop(State_1.State.Datum, color_sign, new_color_sign);
        flush_for_undo();
        pub();
    }
    State_1.onColorsChange = onColorsChange;
    function getMyCss() {
        return Lib.gencss(State_1.State.Datum);
    }
    State_1.getMyCss = getMyCss;
    function export_palette() {
        return _.map(Lib.sort_datum(State_1.State.Datum), function (v, k) {
            return State_1.State.Datum[v][0].data;
        });
    }
    State_1.export_palette = export_palette;
    function import_palette(palette) {
        Lib.rebuild_palette(palette, State_1.State.Datum);
        flush_for_undo();
        pub();
    }
    State_1.import_palette = import_palette;
    function undo() {
        if (State_1.State.UndoStack.length > 0) {
            Lib.rebuild_palette(State_1.State.UndoStack.pop(), State_1.State.Datum);
        }
        pub();
    }
    State_1.undo = undo;
    function like_facebook() {
        import_palette(Const.like_facebook);
    }
    State_1.like_facebook = like_facebook;
    function like_google() {
        import_palette(Const.like_google);
    }
    State_1.like_google = like_google;
    function like_ebay() {
        import_palette(Const.like_ebay);
    }
    State_1.like_ebay = like_ebay;
    function like_reddit() {
        import_palette(Const.like_reddit);
    }
    State_1.like_reddit = like_reddit;
    function like_bootstrap_3() {
        import_palette(Const.like_bootstrap_3);
    }
    State_1.like_bootstrap_3 = like_bootstrap_3;
    function like_amazon() {
        import_palette(Const.like_amazon);
    }
    State_1.like_amazon = like_amazon;
    function flush_for_undo() {
        State_1.State.UndoStack.push(export_palette());
    }
    function pub() {
        _.map(_subscribers, function (v, k) {
            v(State_1.State);
        });
    }
    State_1.pub = pub;
    function sub(cb) {
        var id = Lib.gensym();
        _subscribers[id] = cb;
        return id;
    }
    State_1.sub = sub;
    function unsub(id) {
        delete _subscribers[id];
    }
    State_1.unsub = unsub;
})(State || (State = {}));
var Lib;
(function (Lib) {
    var content_selector = Const.content_selector;
    function gensym() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
    }
    Lib.gensym = gensym;
    function rgb2hex(rgb) {
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? "#" +
            ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
    }
    Lib.rgb2hex = rgb2hex;
    function parsedRgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    Lib.parsedRgbToHex = parsedRgbToHex;
    function isSelectorTag(data) {
        if (data[0] == "#" || data[0] == ".") {
            return false;
        }
        return true;
    }
    function gencss(d) {
        return _.map(d, function (v, k) {
            var color = v[0].data;
            var properties = {};
            _.map(v, function (v2, k2) {
                try {
                    properties[v2.prop_type].push(v2.selector);
                }
                catch (e) {
                    properties[v2.prop_type] = [v2.selector];
                }
            });
            return _.map(properties, function (v2, k2) {
                return (v2.join(", ") + "{\n") +
                    ("    " + k2 + ":" + color + " !important;\n}");
            }).join("\n");
        }).join("\n");
    }
    Lib.gencss = gencss;
    function tree_walker(node, func) {
        func(node);
        var node = node.firstChild;
        while (node) {
            tree_walker(node, func);
            var node = node.nextSibling;
        }
    }
    function rebuild_palette(palette, data) {
        var datum = sort_datum(data);
        var palette = palette.concat(palette)
            .concat(palette).concat(palette);
        for (var k in palette) {
            modify_prop(data, datum[k], palette[k]);
        }
        return data;
    }
    Lib.rebuild_palette = rebuild_palette;
    function sort_datum(data) {
        return Lazy(data).keys().sort(function (a, b) {
            var a_el = data[a];
            var b_el = data[b];
            var r = popularity_rang(a_el) < popularity_rang(b_el) ? 1 : 0;
            return r;
        }).toArray();
    }
    Lib.sort_datum = sort_datum;
    function make_selector(el, use_class, use_id, use_name) {
        if (use_class === void 0) { use_class = true; }
        if (use_id === void 0) { use_id = true; }
        if (use_name === void 0) { use_name = true; }
        try {
            var css_class = _.compact($(el).attr("class").split(/[\s\n]+/));
            var css_id = $(el).attr("id");
            var css_name = $(el).prop("tagName");
            if (css_id && use_id) {
                return "#" + css_id.trim();
            }
            if (css_class.length && use_class) {
                return "." + css_class.join(".");
            }
            if (css_name && use_name) {
                return css_name + ":not([class]):not([id])";
            }
        }
        catch (e) {
            return "";
        }
    }
    Lib.make_selector = make_selector;
    function popularity_rang(data) {
        var result = 0;
        for (var k in data) {
            result += data[k].coords.x * data[k].coords.y;
        }
        return result;
    }
    Lib.popularity_rang = popularity_rang;
    function truncate_color_garbage(data) {
        var result = rgb2hex(data.match(/rgba?\([0-9,\s]+\)/)[0]);
        return result;
    }
    function make_component(el, prop) {
        if (prop === void 0) { prop = "color"; }
        try {
            var css_prop = truncate_color_garbage($(el).css(prop));
        }
        catch (e) {
            var css_prop = "";
        }
        try {
            var el_X = el.width();
            var el_Y = el.height();
        }
        catch (e) {
            var el_X = 0;
            var el_Y = 0;
        }
        var selector = make_selector($(el));
        if (selector == "" || selector == undefined) {
            return null;
        }
        if (css_prop == "#000000" || css_prop == "") {
            return null;
        }
        var prop_type = isSelectorTag(selector) ? "color_generale" : "color_minor";
        var element_object = {
            selector: selector,
            data: css_prop,
            type: prop_type,
            prop_type: prop,
            coords: { x: el_X, y: el_Y }
        };
        return element_object;
    }
    function modify_prop(Datum, old_prop, new_prop) {
        for (var k in Datum[old_prop]) {
            var el = Datum[old_prop][k];
            el.data = new_prop;
            try {
                $(Const.content_selector).find(el.selector).css(el.prop_type, new_prop);
            }
            catch (e) {
                "";
            }
        }
        return Datum;
    }
    Lib.modify_prop = modify_prop;
    function append_data(context, dublicates, component, prop) {
        var el = make_component($(component), prop);
        if (el && el.selector) {
            if (dublicates[el.prop_type + el.selector]) {
                return context;
            }
            if (context[el.data] == undefined) {
                context[el.data] = [el];
            }
            else {
                context[el.data].push(el);
            }
            dublicates[el.prop_type + el.selector] = true;
        }
        return context;
    }
    function collect_data(selector) {
        var result = {};
        var isRepeated = {};
        tree_walker(selector.get(0), function (el) {
            append_data(result, isRepeated, $(el), "color");
            append_data(result, isRepeated, $(el), "background");
            append_data(result, isRepeated, $(el), "background-color");
        });
        delete result[""];
        return result;
    }
    Lib.collect_data = collect_data;
    function apply_rules(data, selector) {
        if (selector === void 0) { selector = "#content"; }
        _.map(data, function (v, k) {
            _.map(v, function (v2, k2) {
                $(selector).find(v2.selector).css(v2.prop_type, v2.data);
            });
        });
    }
    Lib.apply_rules = apply_rules;
})(Lib || (Lib = {}));
var div = React.DOM.div;
var h1 = React.DOM.h1;
var h2 = React.DOM.h2;
var h3 = React.DOM.h3;
var h4 = React.DOM.h4;
var h5 = React.DOM.h5;
var textarea = React.DOM.textarea;
var span = React.DOM.span;
var button = React.DOM.button;
var img = React.DOM.img;
var hr = React.DOM.hr;
var input = React.DOM.input;
var br = React.DOM.br;
var i = React.DOM.i;
var video = React.DOM.video;
var Content;
(function (Content) {
    var CONTENT = $("#frame").contents().find("#content");
    $(CONTENT).on('paste', function () {
        $("#content-background").remove();
        var element = this;
        setTimeout(function () {
            State.onContentChange();
        }, 100);
    });
})(Content || (Content = {}));
var Modal;
(function (Modal) {
    function makeModal(data) {
        var el = $("<div class='anyModal'></div>");
        $("body").append(el);
        el.html(data);
        $(el)["modal"]().open();
    }
    Modal.makeModal = makeModal;
})(Modal || (Modal = {}));
var ColorEditor;
(function (ColorEditor_1) {
    function getMyCss() {
        Modal.makeModal("<textarea class='modalBody'>" + State.getMyCss() + "</textarea>");
    }
    var ColorEditor = React.createClass({
        render: function () {
            var _this = this;
            var result = Lazy(_this.props.State.Datum)
                .keys()
                .sort(function (a, b) {
                var a_el = _this.props.State.Datum[a];
                var b_el = _this.props.State.Datum[b];
                var r = Lib.popularity_rang(a_el) < Lib.popularity_rang(b_el) ? 1 : 0;
                return r;
            })
                .filter(function (el) {
                var full_el = _this.props.State.Datum[el];
                if (Lib.popularity_rang(full_el) == 0) {
                    return false;
                }
                return true;
            })
                .map(function (el) {
                var color = _this.props.State.Datum[el][0].data;
                return input({ type: "color",
                    value: color,
                    onChange: function (e) {
                        State.onColorsChange(el, e.target.value);
                    }
                }, []);
            })
                .toArray();
            return div({}, [result]);
        }
    });
    Mousetrap.bindGlobal("ctrl+z", function (e) {
        e.preventDefault();
        console.log("now undo");
        State.undo();
    });
    var ImageDropper = React.createClass({
        onNewFile: function (e) {
            State.onImageUploaded(e.nativeEvent.target);
        },
        render: function () {
            var _this = this;
            return input({
                type: "file",
                className: "file-dropper",
                onChange: _this.onNewFile,
                ref: "dropzone-ref" });
        }
    });
    var LeftMenuPanel = React.createClass({
        fuid: "",
        getInitialState: function () {
            return { Datum: {} };
        },
        componentDidMount: function () {
            var _this = this;
            _this.fuid = State.sub(function (data) {
                _this.setState(data);
            });
        },
        componentDidUpdate: function () {
        },
        componentWillUnmount: function () {
            var _this = this;
            State.unsub(_this.fuid);
        },
        render: function () {
            var _this = this;
            if (_.keys(_this.state.Datum).length == 0) {
                var innerHtml = "\n                    <hr>\n                    <h2 class=\"\" >Modify color styles of any page</h2>\n                    <hr>\n                    <div class=\"description \">\n                    This is <b>the Colorator</b>. \n                    It's main purpose is to select the best pallitre possible.<p><p>\n                     <hr>\n                     Open any site<p>\n                     Select and copy it to the left<p>\n                     Modify it's color scheme<p>\n                    <hr>\n                    The best color tool for designers with deadlines.<P>\n                </div>";
                return div({ dangerouslySetInnerHTML: { __html: innerHtml } });
            }
            var general_colors = ColorEditor({ State: _this.state, colorType: "color_generale" });
            var minor_colors = ColorEditor({ State: _this.state, colorType: "color_minor" });
            return div({}, [
                hr({}),
                h2({ className: "inset-darktext" }, "You can change any color"),
                minor_colors,
                hr({}),
                h2({}, "Or you could use an image as a source"),
                ImageDropper({ addedFile: console.log }),
                hr({}),
                button({ className: "getMyCss", onClick: getMyCss }, "Get My CSS!")
            ]);
        }
    });
    React.render(LeftMenuPanel({}), $("#color-content").get(0));
})(ColorEditor || (ColorEditor = {}));
