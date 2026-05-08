/* ============================================
   THE STR CONSULTANT
   Canvas Animations & Scroll Interactions
   ============================================ */
(function(){
'use strict';

document.addEventListener('DOMContentLoaded',()=>{

/* ─── SCROLL REVEAL ─── */
const io=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
        if(e.isIntersecting){
            const siblings=e.target.parentElement.querySelectorAll('.sf');
            const idx=Array.from(siblings).indexOf(e.target);
            setTimeout(()=>e.target.classList.add('v'),idx*70);
            io.unobserve(e.target);
        }
    });
},{threshold:0.12,rootMargin:'0px 0px -30px 0px'});
document.querySelectorAll('.sf').forEach(el=>io.observe(el));

/* ─── SMOOTH SCROLL ─── */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',function(e){
        const h=this.getAttribute('href');if(h==='#')return;
        e.preventDefault();
        const t=document.querySelector(h);
        if(t){window.scrollTo({top:t.getBoundingClientRect().top+window.pageYOffset-70,behavior:'smooth'})}
    });
});

/* ─── NAV SCROLL ─── */
const nav=document.querySelector('.nav');
window.addEventListener('scroll',()=>{
    nav.style.background=window.scrollY>40?'rgba(6,8,10,0.94)':'rgba(6,8,10,0.82)';
},{passive:true});

/* ─── CANVAS UTILS ─── */
const DPR=window.devicePixelRatio||1;
function sizeCanvas(canvas){
    const r=canvas.parentElement.getBoundingClientRect();
    canvas.width=r.width*DPR;canvas.height=r.height*DPR;
    canvas.style.width=r.width+'px';canvas.style.height=r.height+'px';
    const ctx=canvas.getContext('2d');ctx.scale(DPR,DPR);
    return{w:r.width,h:r.height,ctx};
}

/* ─── HERO CANVAS ─── */
const hc=document.getElementById('hero-canvas');
if(hc){
    let particles=[];let raf;
    function initHero(){
        const{w,h}=sizeCanvas(hc);
        particles=[];
        for(let i=0;i<35;i++){
            particles.push({
                x:Math.random()*w,y:Math.random()*h,
                vx:0.2+Math.random()*0.4,vy:(Math.random()-0.5)*0.25,
                r:1+Math.random()*1.2,a:0.15+Math.random()*0.35,
                life:Math.random()*300,max:200+Math.random()*200
            });
        }
    }
    function drawHero(){
        const w=hc.clientWidth,h=hc.clientHeight;
        const ctx=hc.getContext('2d');
        ctx.clearRect(0,0,w,h);
        // connections
        for(let i=0;i<particles.length;i++){
            for(let j=i+1;j<particles.length;j++){
                const dx=particles[i].x-particles[j].x,dy=particles[i].y-particles[j].y;
                const d=Math.sqrt(dx*dx+dy*dy);
                if(d<110){
                    ctx.strokeStyle='rgba(52,211,153,0.06)';
                    ctx.lineWidth=0.5;ctx.globalAlpha=(1-d/110)*0.4;
                    ctx.beginPath();ctx.moveTo(particles[i].x,particles[i].y);
                    ctx.lineTo(particles[j].x,particles[j].y);ctx.stroke();
                }
            }
        }
        // particles
        particles.forEach((p,i)=>{
            p.x+=p.vx;p.y+=p.vy;p.life++;
            let f=1;if(p.life<25)f=p.life/25;if(p.life>p.max-25)f=(p.max-p.life)/25;
            ctx.globalAlpha=p.a*Math.max(0,f);
            ctx.fillStyle='#34d399';
            ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
            // glow
            ctx.globalAlpha=p.a*Math.max(0,f)*0.15;
            ctx.beginPath();ctx.arc(p.x,p.y,p.r*4,0,Math.PI*2);ctx.fill();
            if(p.x>w+10||p.life>=p.max){
                particles[i]={x:Math.random()*w*0.2,y:20+Math.random()*(h-40),
                    vx:0.2+Math.random()*0.4,vy:(Math.random()-0.5)*0.25,
                    r:1+Math.random()*1.2,a:0.15+Math.random()*0.35,life:0,max:200+Math.random()*200};
            }
        });
        ctx.globalAlpha=1;
        raf=requestAnimationFrame(drawHero);
    }
    initHero();drawHero();
    window.addEventListener('resize',initHero);
}

/* ─── BROKEN CANVAS ─── */
const bc=document.getElementById('broken-canvas');
if(bc){
    let nodes=[];let braf;
    function initBroken(){
        const{w,h}=sizeCanvas(bc);
        nodes=[];
        for(let i=0;i<35;i++){
            nodes.push({x:Math.random()*w,y:Math.random()*h,
                vx:(Math.random()-0.5)*0.35,vy:(Math.random()-0.5)*0.35,
                r:1.5+Math.random()*1.5});
        }
    }
    function drawBroken(){
        const w=bc.clientWidth,h=bc.clientHeight;
        const ctx=bc.getContext('2d');
        ctx.clearRect(0,0,w,h);
        ctx.setLineDash([3,5]);
        for(let i=0;i<nodes.length;i++){
            for(let j=i+1;j<nodes.length;j++){
                const dx=nodes[i].x-nodes[j].x,dy=nodes[i].y-nodes[j].y;
                const d=Math.sqrt(dx*dx+dy*dy);
                if(d<100&&d>30){
                    ctx.strokeStyle='rgba(239,107,107,0.06)';
                    ctx.lineWidth=0.5;ctx.globalAlpha=(1-d/100)*0.5;
                    ctx.beginPath();ctx.moveTo(nodes[i].x,nodes[i].y);
                    const mx=(nodes[i].x+nodes[j].x)/2+(Math.random()-0.5)*12;
                    const my=(nodes[i].y+nodes[j].y)/2+(Math.random()-0.5)*12;
                    ctx.lineTo(mx,my);ctx.stroke();
                }
            }
        }
        ctx.setLineDash([]);
        nodes.forEach(n=>{
            n.x+=n.vx;n.y+=n.vy;
            if(n.x<0||n.x>w)n.vx*=-1;
            if(n.y<0||n.y>h)n.vy*=-1;
            ctx.globalAlpha=0.2;ctx.fillStyle='#ef6b6b';
            ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,Math.PI*2);ctx.fill();
        });
        ctx.globalAlpha=1;
        braf=requestAnimationFrame(drawBroken);
    }
    const bObs=new IntersectionObserver(entries=>{
        entries.forEach(e=>{
            if(e.isIntersecting){initBroken();drawBroken();}
            else{cancelAnimationFrame(braf);}
        });
    },{threshold:0.05});
    bObs.observe(bc.parentElement);
    window.addEventListener('resize',initBroken);
}

/* ─── CTA CANVAS ─── */
const cc=document.getElementById('cta-canvas');
if(cc){
    let grid=[];let craf;
    function initCta(){
        const{w,h}=sizeCanvas(cc);
        grid=[];
        const cols=7,rows=4;
        for(let i=0;i<cols;i++){
            for(let j=0;j<rows;j++){
                grid.push({
                    bx:w*0.08+i/(cols-1)*w*0.84,
                    by:h*0.12+j/(rows-1)*h*0.76,
                    x:0,y:0,off:Math.random()*Math.PI*2,r:2
                });
            }
        }
    }
    function drawCta(){
        const w=cc.clientWidth,h=cc.clientHeight;
        const ctx=cc.getContext('2d');
        const t=Date.now()*0.001;
        ctx.clearRect(0,0,w,h);
        grid.forEach(n=>{n.x=n.bx+Math.sin(t+n.off)*5;n.y=n.by+Math.cos(t*0.65+n.off)*3});
        // links
        ctx.strokeStyle='rgba(52,211,153,0.06)';ctx.lineWidth=0.5;
        for(let i=0;i<grid.length;i++){
            for(let j=i+1;j<grid.length;j++){
                const dx=grid[i].x-grid[j].x,dy=grid[i].y-grid[j].y;
                const d=Math.sqrt(dx*dx+dy*dy);
                if(d<120){
                    ctx.globalAlpha=(1-d/120)*0.5;
                    ctx.beginPath();ctx.moveTo(grid[i].x,grid[i].y);
                    ctx.lineTo(grid[j].x,grid[j].y);ctx.stroke();
                }
            }
        }
        // dots
        grid.forEach(n=>{
            ctx.globalAlpha=0.5;ctx.fillStyle='#34d399';
            ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,Math.PI*2);ctx.fill();
            ctx.globalAlpha=0.1;
            ctx.beginPath();ctx.arc(n.x,n.y,n.r*3.5,0,Math.PI*2);ctx.fill();
        });
        ctx.globalAlpha=1;
        craf=requestAnimationFrame(drawCta);
    }
    const cObs=new IntersectionObserver(entries=>{
        entries.forEach(e=>{
            if(e.isIntersecting){initCta();drawCta();}
            else{cancelAnimationFrame(craf);}
        });
    },{threshold:0.05});
    cObs.observe(cc.parentElement);
    window.addEventListener('resize',initCta);
}

});
})();
