/**
 * 改变大小的侧边栏指令
 * position: 侧边栏位置: top、right、bottom、left
 * backgroundColor: 背景颜色
 * size: 侧边栏宽度
 */
const resizeBar = {
    mounted(el, binding) {
        // 侧边栏位置
        const position = binding.value.position;
        let size = "5px";
        if (binding.value.size) {
            size = binding.value.size
        }
        let axis, pointOrientation;
        if (position === "top" || position === "bottom") {
            axis = "height";
            pointOrientation = "clientY";
        } else if (position === "right" || position === "left") {
            axis = "width";
            pointOrientation = "clientX";
        }
        // 侧边栏
        const sidebar = document.createElement("div");
        sidebar.style.position = "absolute";
        sidebar.style[position] = "0px";
        sidebar.style.top = "0px";
        sidebar.style[axis] = size;
        sidebar.style[axis === "height" ? "width" : "height"] = "100%";
        sidebar.style.cursor = position === "left" || position == "right" ? "w-resize" : "n-resize";
        sidebar.style.zIndex = "99999"
        sidebar.style.background = binding.value.backgroundColor;
        sidebar.style.opacity = 0;
        sidebar.style.transition = "all .5s";

        // if (position === 'top') {
        //     sidebar.style.top = "0px";
        //     sidebar.style.left = "0px";
        //     sidebar.style.width = "100%";
        //     sidebar.style.height = size;
        // } else if (position === "right") {
        //     sidebar.style.top = "0px";
        //     sidebar.style.right = "0px";
        //     sidebar.style.width = size;
        //     sidebar.style.height = "100";
        // } else if (position === "bottom") {
        //     sidebar.style.left = "0px";
        //     sidebar.style.bottom = "0px";
        //     sidebar.style.width = "100%";
        //     sidebar.style.height = size;
        // } else if (position === "left") {
        //     sidebar.style.left = "0px";
        //     sidebar.style.top = "0px";
        //     sidebar.style.width = size;
        //     sidebar.style.height = "100";
        // }

        function get_size() {
            return parseInt(window.getComputedStyle(el)[axis]);
        }
        // 
        let startPoint, startSize;
        sidebar.addEventListener("mousedown", (e) => {
            startPoint = e[pointOrientation];
            startSize = get_size();
            document.documentElement.addEventListener("mousemove", onDrag);
            document.documentElement.addEventListener("mouseup", stopDrag);
        })
        sidebar.addEventListener("mouseenter", () => {
            sidebar.style.opacity = 1;
        })
        sidebar.addEventListener("mouseleave", () => {
            sidebar.style.opacity = 0;
        })
        function onDrag(e) {
            let newSize;
            if (position === "right" || position === "bottom") {
                newSize = e[pointOrientation] - startPoint + startSize;
            } else {
                newSize = startSize + startPoint - e[pointOrientation];
            }
            el.style[axis] = newSize + "px";
        }
        function stopDrag(e) {
            document.documentElement.removeEventListener("mousemove", onDrag);
            document.documentElement.removeEventListener("mouseup", stopDrag);
        }
        el.appendChild(sidebar);
    }
}

export default resizeBar