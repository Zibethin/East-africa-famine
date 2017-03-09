/**
 * @description Polyfill for element based media-queries.
 * @version v0.2
 * @author Marc J. Schmidt
 * @license MIT, http://www.opensource.org/licenses/MIT
 * @url http://marcj.github.io/css-element-queries/
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2013 Marc J. Schmidt
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
(function () {
    this.ResizeSensor = function (b, e) {
        function m() {
            this.q = []; this.add = function (a) {
                this.q.push(a)
            };
            var a, b;
            this.call = function () { a = 0; for (b = this.q.length; a < b; a++) this.q[a].call() }
        } function n(a, b) {
            return a.currentStyle ? a.currentStyle[b] : window.getComputedStyle ? window.getComputedStyle(a, null).getPropertyValue(b) : a.style[b]
        } function l(a, b) {
            if (!a.resizedAttached) a.resizedAttached = new m, a.resizedAttached.add(b);
            else if (a.resizedAttached) { a.resizedAttached.add(b); return } a.resizeSensor = document.createElement("div");
            a.resizeSensor.className = "resize-sensor";
            a.resizeSensor.style.cssText = "position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: scroll; z-index: -1; visibility: hidden;";
            a.resizeSensor.innerHTML = '<div class="resize-sensor-expand" style="position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: scroll; z-index: -1; visibility: hidden;"><div style="position: absolute; left: 0; top: 0;"></div></div><div class="resize-sensor-shrink" style="position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: scroll; z-index: -1; visibility: hidden;"><div style="position: absolute; left: 0; top: 0; width: 200%; height: 200%"></div></div>';
            a.appendChild(a.resizeSensor);
            ({ fixed: 1, absolute: 1 })[n(a, "position")] || (a.style.position = "relative");
            var c = a.resizeSensor.childNodes[0], d = c.childNodes[0], f = a.resizeSensor.childNodes[1], g, h, k = function () {
                d.style.width = c.offsetWidth + 10 + "px";
                d.style.height = c.offsetHeight + 10 + "px";
                c.scrollLeft = c.scrollWidth; c.scrollTop = c.scrollHeight; f.scrollLeft = f.scrollWidth;
                f.scrollTop = f.scrollHeight; g = a.offsetWidth; h = a.offsetHeight
            }; k(); var e = function (a, b, c) {
                a.attachEvent ? a.attachEvent("on" + b, c) : a.addEventListener(b, c)
            };
            e(c, "scroll", function () {
                (a.offsetWidth > g || a.offsetHeight > h) && a.resizedAttached && a.resizedAttached.call(); k()
            }); e(f, "scroll", function () { (a.offsetWidth < g || a.offsetHeight < h) && a.resizedAttached && a.resizedAttached.call(); k() })
        } if ("[object Array]" === Object.prototype.toString.call(b) || "undefined" !== typeof jQuery && b instanceof jQuery || "undefined" !== typeof Elements && b instanceof Elements) for (var d = 0, p = b.length; d < p; d++) l(b[d], e); else l(b, e); this.detach = function () { ResizeSensor.detach(b) }
    }; this.ResizeSensor.detach =
function (b) {
    b.resizeSensor && (b.removeChild(b.resizeSensor), delete b.resizeSensor, delete b.resizedAttached)
}
})();

(function () {
    var f = ["discoveryRestUrl", "methodId", "apiKey", "clientId", "useCors"], g = !1;
    function k() {
        if (!g) {
            g = !0; for (var d = document.querySelectorAll(".apis-explorer"), a = {}, e = 0; e < d.length; a = { b: a.b, c: a.c, a: a.a }, e++) {
                a.b = d[e]; a.b.textContent = ""; a.a = document.createElement("iframe"); a.c = [];
                f.forEach(function (a) {
                    return function (b) {
                        var h = a.b.getAttribute(l(b));
                        null != h && a.c.push(b + "=" + encodeURIComponent(h))
                    }
                }(a));
                var c = window.location.search.match(/[&?](authuser)=(\d+)/i); c && a.c.push(c[1] + "=" + c[2]);
                a.a.src = "https://explorer.apis.google.com/embedded.html?" + a.c.join("&"); a.a.frameBorder = "0"; a.a.scrolling = "no";
                a.a.onload = function (a) { return function () { a.a.contentWindow.postMessage("apix_frame_enable", "https://explorer.apis.google.com") } }(a);
                a.a.width = a.b.offsetWidth;
                c = function (a) {
                    return function () {
                        setTimeout(function () {
                            window.requestAnimationFrame(function () {
                                var b = a.b.offsetWidth; a.a.width != b && (a.a.width = b, a.a.contentWindow.postMessage({ apix_embedder_event: "resized" }, "https://explorer.apis.google.com"))
                            })
                        })
                    }
                }(a);
                a.b.appendChild(a.a);
                new ResizeSensor(a.b, c);
                window.addEventListener("resize", c); window.addEventListener("message",
function (a) {
    return function (b) {
        "https://explorer.apis.google.com" === b.origin && b.source === a.a.contentWindow && "object" === typeof b.data && "apix_event" in b.data && ("resize" == b.data.apix_event ? a.a.height = b.data.height + "px" : console.debug("Unknown event", b.data))
    }
}(a))
            }
        }
    } function l(d) { return "data-" + d.replace(/[A-Z]/g, function (a) { return "-" + a.toLowerCase() }) } window.addEventListener("load", k); "complete" == document.readyState && k();
}).call(this);
