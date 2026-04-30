import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MockDataService } from '../core/mock-data.service';
import { Job } from '../models/user.model';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
  <div class="landing-page">
      <!-- Rotating Badge -->
      <div class="circular-badge">
        <svg viewBox="0 0 100 100" width="120" height="120">
          <defs><path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" /></defs>
          <text><textPath href="#circlePath" startOffset="0%">Apply for a Job • Apply for a Job • </textPath></text>
        </svg>
        <div class="badge-center">✨</div>
      </div>

      <!-- Navigation -->
      <nav class="navbar">
        <div class="logo">
           <div class="logo-icon blur-glow">O</div><span>RBIT</span>
        </div>
        <div class="nav-links">
          <a href="#" class="nav-item">Home</a>
          <a routerLink="/login" class="nav-item">Find Jobs</a>
          <a routerLink="/login" class="nav-item">Post a Job</a>
        </div>
        <div class="nav-actions">
           <a routerLink="/login" class="nav-btn-text">Log in</a>
           <a routerLink="/register" class="nav-btn btn-primary">Register Now</a>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">Get The Right Job <br><span>You Deserve</span></h1>
          <p class="hero-subtitle">{{ totalJobs }} jobs available! Your dream career starts here.</p>
          
          <!-- Hero Search Bar -->
          <div class="hero-search-box">
             <div class="search-input-group">
                <span class="icon">🔍</span>
                <input type="text" placeholder="Job title or keyword">
             </div>
             <button class="btn btn-primary search-btn">Search</button>
          </div>
        </div>
      </section>

      <!-- Trending Jobs Panel -->
      <section class="trending-section" *ngIf="trendingJobs.length > 0">
         <div class="section-header">
           <h2>Trending Jobs</h2>
           <a routerLink="/login" class="see-all">See All Jobs <span>→</span></a>
         </div>
         <div class="trending-grid">
           <div class="trend-card" *ngFor="let job of trendingJobs; let i = index" 
                [style.background]="i % 3 === 0 ? '#EEFAD4' : (i % 3 === 1 ? '#F2EDFC' : '#EBF4FA')"
                [style.animation-delay]="(i * 0.1) + 's'">
              <div class="card-top">
                 <div class="info">
                   <h3>{{ job.title }}</h3>
                   <p>{{ job.companyName || 'Verified Company' }} <span class="badge-verify">✓</span></p>
                 </div>
                 <div class="c-logo">{{ (job.companyName || 'C').charAt(0) }}</div>
              </div>
              <p class="desc">{{ job.description | slice:0:100 }}...</p>
              <div class="tags">
                <span class="tag">📍 {{ job.location || 'Remote' }}</span>
                <span class="tag">⏱ {{ job.type || 'Full-time' }}</span>
              </div>
              <div class="card-bot">
                <div class="sal"><strong>\${{ job.salary || '40K' }}</strong><span>Monthly</span></div>
                <button routerLink="/login" class="btn btn-outline" style="border-color: #0A3641;">Apply Now</button>
              </div>
           </div>
         </div>
      </section>

      <!-- Advanced Feature Section -->
      <section class="platform-section">
         <div class="plat-header">
           <h2>One platform Many Solutions</h2>
           <a href="#" class="see-all">See All Platform <span>→</span></a>
         </div>
         <div class="plat-grid">
            <div class="plat-item slide-in"><span>🚀</span> IT Management <strong>></strong></div>
            <div class="plat-item active slide-in" style="animation-delay: 0.1s"><span>✏️</span> UI/UX Design <div class="badge">78 Jobs</div></div>
            <div class="plat-item slide-in" style="animation-delay: 0.2s"><span>🔬</span> Human Research <div class="badge" style="background:transparent; color:var(--text-muted)">120 Jobs Available</div> <strong>></strong></div>
            <div class="plat-item slide-in" style="animation-delay: 0.3s"><span>⚙️</span> Management <div class="badge" style="background:transparent; color:var(--text-muted)">52 Jobs Available</div> <strong>></strong></div>
            <div class="plat-item slide-in" style="animation-delay: 0.4s"><span>💰</span> Finance <div class="badge" style="background:transparent; color:var(--text-muted)">85 Jobs Available</div> <strong>></strong></div>
         </div>
      </section>
      <!-- Global Reach / Earth Section -->
      <section class="global-section">
         <div class="global-content slide-in">
            <h2>Worldwide Opportunities</h2>
            <p>Connect with top companies across 50+ countries. Our platform has no borders, bringing global tech hubs directly to your fingertips.</p>
            <div class="stats-row">
              <div><strong>120+</strong><span>Countries</span></div>
              <div><strong>50M+</strong><span>Users</span></div>
            </div>
         </div>
         <div class="earth-container">
            <div class="orbit-ring"></div>
            <div class="earth-orbit">
               <div class="satellite">🛰️</div>
            </div>
            <div class="colorful-earth"></div>
         </div>
      </section>

      <!-- Testimonials -->
      <section class="reviews-section">
         <div class="rev-header">
           <h2>What Our Users Say</h2>
           <p>Don't just take our word for it. Join thousands of happy job seekers.</p>
         </div>
         <div class="rev-grid">
            <div class="rev-card slide-in" style="animation-delay: 0.1s">
               <div class="stars">⭐⭐⭐⭐⭐</div>
               <p>"This platform transformed my job search. The UI is incredibly intuitive and I landed 3 interviews in my first week!"</p>
               <div class="author">
                  <div class="avatar" style="background:#EEFAD4">👨‍💻</div>
                  <div><strong>Alex Johnson</strong><span>Software Engineer</span></div>
               </div>
            </div>
            <div class="rev-card slide-in" style="animation-delay: 0.2s">
               <div class="stars">⭐⭐⭐⭐⭐</div>
               <p>"As a recruiter, finding quality candidates is hard. This platform's smart matching saved us countless hours."</p>
               <div class="author">
                  <div class="avatar" style="background:#EBF4FA">👩‍💼</div>
                  <div><strong>Sarah Williams</strong><span>HR Manager, TechCorp</span></div>
               </div>
            </div>
            <div class="rev-card slide-in" style="animation-delay: 0.3s">
               <div class="stars">⭐⭐⭐⭐⭐</div>
               <p>"I love the clean, modern aesthetic. It feels fast, responsive, and makes tracking applications an absolute breeze."</p>
               <div class="author">
                  <div class="avatar" style="background:#F2EDFC">👨‍🎓</div>
                  <div><strong>Michael Chen</strong><span>Recent Graduate</span></div>
               </div>
            </div>
         </div>
      </section>

      <!-- FAQ Section -->
      <section class="faq-section">
         <h2>Frequently Asked Questions</h2>
         <div class="faq-grid">
            <div class="faq-item">
               <h3>Is the platform free for students?</h3>
               <p>Yes! Creating a profile and applying to jobs is 100% free for all students and job seekers.</p>
            </div>
            <div class="faq-item">
               <h3>How does the smart matching work?</h3>
               <p>Our algorithm analyzes your skills, experience, and preferences to recommend jobs where you have the highest chance of success.</p>
            </div>
            <div class="faq-item">
               <h3>Can recruiters post unlimited jobs?</h3>
               <p>Verified recruiters can post unlimited jobs and manage candidates directly through our integrated dashboard.</p>
            </div>
         </div>
      </section>
      
      <!-- Footer CTA -->
      <div class="footer-cta">
        <h2>Ready to get started?</h2>
        <p>Join thousands of students and companies on ORBIT today.</p>
        <a routerLink="/register" class="btn btn-primary" style="padding: 18px 40px; font-size: 1.1rem; border-radius: 50px; display: inline-block;">Create Free Account</a>
      </div>
    </div>
  `,
  styles: [`
    .landing-page {
      min-height: 100vh; 
      background-color: var(--bg-primary);
      background-image: radial-gradient(var(--border-medium) 1px, transparent 1px);
      background-size: 40px 40px;
      font-family: 'Inter', system-ui, sans-serif; position: relative; overflow-x: hidden;
      color: var(--text-dark);
    }

    /* Circular Badge Animation */
    .circular-badge {
      position: absolute; top: 120px; left: 8%; z-index: 5;
      animation: floatBadge 6s ease-in-out infinite;
    }
    .circular-badge svg {
      animation: spin 10s linear infinite;
    }
    .circular-badge text {
      font-size: 13px; font-weight: 700; fill: var(--text-dark); letter-spacing: 2px;
    }
    .badge-center {
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      font-size: 1.5rem; background: var(--primary); width: 44px; height: 44px;
      display:flex; align-items:center; justify-content:center; border-radius: 50%;
    }
    @keyframes spin { 100% { transform: rotate(360deg); } }
    @keyframes floatBadge { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }

    /* Navbar */
    .navbar { display: flex; justify-content: space-between; align-items: center; padding: 24px 5%; position: relative; z-index: 10; animation: fadeInDown 0.8s ease; }
    .logo { display: flex; align-items: center; gap: 4px; font-size: 1.8rem; font-weight: 800; color: var(--text-dark); letter-spacing: -0.5px; }
    .logo-icon { color: var(--primary); font-size: 2rem; font-weight: 900;}
    .nav-links { display: flex; gap: 32px; align-items: center; font-weight: 600; font-size: 0.95rem; }
    .nav-item { color: var(--text-primary); transition: color 0.3s; text-decoration: none;}
    .nav-item:hover { color: var(--primary-dark); }
    .nav-actions { display: flex; gap: 24px; align-items: center; }
    .nav-btn-text { font-weight: 600; color: var(--text-dark); text-decoration: none; }
    .nav-btn { text-decoration: none; font-weight: 600; padding: 12px 28px; border-radius: var(--radius-full); transition: all 0.3s ease; }
    .nav-btn.btn-primary { color: white; background: linear-gradient(135deg, var(--primary), var(--accent)); box-shadow: 0 4px 15px rgba(20, 184, 166, 0.35); }
    .nav-btn.btn-primary:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(20, 184, 166, 0.5); }

    /* Hero */
    .hero-section { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 50vh; padding: 80px 5% 40px; text-align: center; position: relative; z-index: 10; }
    .hero-content { max-width: 800px; animation: fadeInUp 1s ease; }
    .hero-title { font-size: 4.8rem; font-weight: 800; line-height: 1.1; margin-bottom: 24px; color: var(--text-dark); letter-spacing: -2px; }
    .hero-subtitle { font-size: 1.1rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 60px; font-weight: 500; }
    
    /* Search Box */
    .hero-search-box {
      display: flex; align-items: center; background: white; padding: 10px 10px 10px 24px; border-radius: var(--radius-full);
      box-shadow: 0 20px 40px rgba(0,0,0,0.06); border: 1px solid var(--border-light); max-width: 750px; margin: 0 auto;
      animation: pulseGlow 3s infinite alternate; transition: transform 0.3s;
    }
    .hero-search-box:hover { transform: scale(1.02); }
    @keyframes pulseGlow { 0% { box-shadow: 0 20px 40px rgba(0,0,0,0.06); } 100% { box-shadow: 0 20px 50px rgba(20,184,166,0.2); } }
    
    .search-input-group { display: flex; align-items: center; gap: 12px; flex: 1; text-align: left; }
    .search-input-group .icon { font-size: 1.2rem; }
    .search-input-group input { border: none; outline: none; font-size: 1.05rem; width: 100%; color: var(--text-dark); font-weight: 500; background: transparent; }
    .search-input-group input::placeholder { color: var(--text-muted); }
    .divider { width: 1px; height: 36px; background: var(--border-light); margin: 0 20px; }
    .search-btn { padding: 14px 40px; font-size: 1.05rem; border-radius: var(--radius-full); margin-left: auto; font-weight: 700; height: 100%; }

    /* Marquee */
    .marquee-container {
       overflow: hidden; width: 100%; padding: 40px 0; background: transparent; display: flex; margin-bottom: 40px;
    }
    .marquee-track {
       display: flex; gap: 100px; align-items: center; min-width: 200%;
       animation: scrollMarquee 25s linear infinite;
    }
    .marquee-logo { font-size: 1.8rem; font-weight: 800; color: var(--border-medium); letter-spacing: 1px; transition: color 0.3s; }
    .marquee-logo:hover { color: var(--text-primary); }
    @keyframes scrollMarquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

    /* Trending Jobs */
    .trending-section { padding: 40px 5%; max-width: 1300px; margin: 0 auto 60px; }
    .section-header, .plat-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
    .section-header h2, .plat-header h2 { font-size: 2.2rem; font-weight: 800; color: var(--text-dark); letter-spacing: -1px; margin:0;}
    .see-all { color: var(--text-primary); font-weight: 700; text-decoration: none; font-size: 1rem; transition: color 0.3s; display:flex; align-items:center; gap:8px;}
    .see-all span { transition: transform 0.3s; }
    .see-all:hover span { transform: translateX(5px); }

    .trending-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 24px; }
    .trend-card {
      padding: 30px; border-radius: calc(var(--radius-xl) + 8px);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      animation: slideUpFade 0.8s backwards; opacity:0; animation-fill-mode: forwards;
      border: 1px solid rgba(255,255,255,0.5); display: flex; flex-direction: column;
    }
    .trend-card:hover { transform: translateY(-12px) scale(1.02); box-shadow: 0 24px 50px rgba(0,0,0,0.08); }
    @keyframes slideUpFade { 0% { opacity: 0; transform: translateY(40px); } 100% { opacity: 1; transform: translateY(0); } }

    .card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
    .info h3 { font-size: 1.3rem; font-weight: 800; margin-bottom: 6px; }
    .info p { font-size: 0.95rem; color: var(--text-secondary); display:flex; align-items:center; gap:6px; font-weight: 600; margin:0;}
    .badge-verify { background: #3B82F6; color: white; border-radius: 50%; width: 16px; height: 16px; display:inline-flex; align-items:center; justify-content:center; font-size: 0.65rem;}
    .c-logo { width: 56px; height: 56px; border-radius: 12px; background: white; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: 800; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
    .desc { font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 24px; flex-grow:1;}
    .tags { display: flex; gap: 10px; margin-bottom: 24px; }
    .tag { padding: 6px 14px; background: transparent; border: 1px solid rgba(0,0,0,0.1); border-radius: var(--radius-full); font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); }
    .card-bot { display: flex; justify-content: space-between; align-items: center; }
    .sal strong { font-size: 1.6rem; font-weight: 800; display: block; margin-bottom: 2px;}
    .sal span { font-size: 0.85rem; color: var(--text-secondary); font-weight: 500;}
    .btn-outline { background: transparent; border: 1.5px solid var(--text-dark); color: var(--text-dark); font-weight: 700; border-radius: var(--radius-full); padding: 12px 28px; transition: all 0.3s;}
    .btn-outline:hover { background: var(--text-dark); color: white; transform: translateY(-2px); }

    /* Platform */
    .platform-section { padding: 80px 5% 100px; background: linear-gradient(180deg, white, var(--bg-secondary)); border-top: 1px solid var(--border-light); }
    .plat-header { max-width: 1300px; margin: 0 auto 40px; }
    .plat-grid { display: flex; gap: 20px; flex-wrap: wrap; justify-content: flex-start; max-width: 1300px; margin: 0 auto;}
    .plat-item {
       padding: 16px 28px; background: white; border-radius: var(--radius-full);
       display: flex; align-items: center; gap: 12px; font-weight: 700; font-size: 1.1rem; color: var(--text-primary);
       box-shadow: 0 4px 15px rgba(0,0,0,0.03); cursor: pointer; transition: all 0.3s;
       border: 1px solid var(--border-light);
    }
    .slide-in { animation: fadeInLeft 0.8s backwards; animation-fill-mode: forwards; opacity: 0;}
    .plat-item:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.08); border-color: var(--accent); }
    .plat-item.active { background: var(--text-dark); color: white; border-color: var(--text-dark); }
    .plat-item strong { color: var(--text-muted); font-size: 1.2rem; margin-left: 8px;}
    .plat-item .badge { font-size: 0.8rem; background: rgba(255,255,255,0.2); padding: 6px 12px; border-radius: var(--radius-full); margin-left: 12px; font-weight: 600; white-space:nowrap;}

    /* Global Reach & Detailed Earth */
    .global-section {
      display: flex; align-items: center; justify-content: space-between; gap: 40px;
      padding: 100px 5%; max-width: 1300px; margin: 0 auto; position: relative; z-index: 10;
    }
    .global-content { max-width: 500px; }
    .global-content h2 { font-size: 3rem; font-weight: 800; color: var(--text-dark); margin-bottom: 20px; letter-spacing: -1px; }
    .global-content p { font-size: 1.15rem; color: var(--text-secondary); margin-bottom: 40px; line-height: 1.6; }
    .stats-row { display: flex; gap: 60px; }
    .stats-row strong { font-size: 3rem; color: var(--primary-darker); display: block; font-weight: 900; line-height: 1.1;}
    .stats-row span { font-size: 0.95rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }

    .earth-container { position: relative; width: 450px; height: 450px; display: flex; align-items: center; justify-content: center; perspective: 1000px; }
    
    .orbit-ring {
       position: absolute; width: 550px; height: 550px; border: 2px dashed rgba(20, 184, 166, 0.35);
       border-radius: 50%; transform: rotateX(75deg) rotateY(10deg);
       animation: spinRing 30s linear infinite; z-index: -1;
       box-shadow: 0 0 20px rgba(20, 184, 166, 0.1), inset 0 0 20px rgba(20, 184, 166, 0.1);
    }
    
    .earth-orbit {
       position: absolute; width: 550px; height: 550px; border-radius: 50%;
       transform: rotateX(75deg) rotateY(10deg);
       animation: spinRing 20s linear infinite reverse; z-index: 5;
    }
    
    .colorful-earth {
      width: 380px; height: 380px; border-radius: 50%;
      position: relative; z-index: 2;
      background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Land_ocean_ice_2048.jpg/1024px-Land_ocean_ice_2048.jpg');
      background-size: cover;
      /* Super high saturation and hue-shift for a vivid blue/green Earth */
      filter: saturate(350%) contrast(140%) hue-rotate(20deg) brightness(110%);
      /* 3D sphere lighting & blue atmospheric glow */
      box-shadow: 
         inset 20px 0 60px 10px rgba(0,0,0,0.9), /* Dark side */
         inset -20px 0 30px 10px rgba(255,255,255,0.4), /* Light hit */
         0 0 50px rgba(14, 165, 233, 0.6); /* Blue atmospheric glow */
      animation: spinGlobe 30s linear infinite;
    }
    
    @keyframes spinGlobe { 
       0% { background-position: 0 0; } 
       100% { background-position: 2048px 0; } 
    }
    @keyframes spinRing { 100% { transform: rotateX(75deg) rotateY(10deg) rotateZ(360deg); } }
    @keyframes bob { 100% { transform: translateX(-50%) rotateX(-75deg) rotateY(-10deg) translateY(-15px); } }

    /* Testimonials */
    .reviews-section { padding: 80px 5%; max-width: 1300px; margin: 0 auto; }
    .rev-header { text-align: center; margin-bottom: 50px;}
    .rev-header h2 { font-size: 2.8rem; font-weight: 800; color: var(--text-dark); letter-spacing: -1px; margin-bottom:10px;}
    .rev-header p { font-size: 1.15rem; color: var(--text-secondary); }
    .rev-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px; }
    .rev-card {
       padding: 40px 30px; background: white; border-radius: var(--radius-xl);
       box-shadow: 0 10px 30px rgba(0,0,0,0.04); border: 1px solid var(--border-light);
       transition: all 0.3s;
    }
    .rev-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); border-color: var(--primary); }
    .stars { font-size: 1.2rem; margin-bottom: 20px; letter-spacing: 2px; }
    .rev-card p { font-size: 1.05rem; color: var(--text-dark); line-height: 1.7; font-style: italic; margin-bottom: 30px; }
    .author { display: flex; align-items: center; gap: 16px; }
    .avatar { width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
    .author strong { display: block; font-size: 1.05rem; color: var(--text-dark); }
    .author span { font-size: 0.85rem; color: var(--text-secondary); }

    /* FAQ Section */
    .faq-section { padding: 80px 5% 100px; max-width: 1000px; margin: 0 auto; text-align: center; }
    .faq-section h2 { font-size: 2.8rem; font-weight: 800; color: var(--text-dark); letter-spacing: -1px; margin-bottom: 50px;}
    .faq-grid { display: grid; grid-template-columns: 1fr; gap: 20px; text-align: left; }
    .faq-item {
       background: white; padding: 30px; border-radius: var(--radius-lg);
       border: 1px solid var(--border-light); box-shadow: 0 4px 15px rgba(0,0,0,0.02);
       transition: all 0.3s;
    }
    .faq-item:hover { border-color: var(--text-muted); box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
    .faq-item h3 { font-size: 1.3rem; font-weight: 800; color: var(--text-dark); margin-bottom: 12px; }
    .faq-item p { font-size: 1.05rem; color: var(--text-secondary); line-height: 1.6; }

    /* Footer CTA */
    .footer-cta { text-align: center; padding: 100px 5%; background: var(--bg-secondary); position: relative; z-index: 10; border-top:1px solid var(--border-light);}
    .footer-cta h2 { font-size: 3.5rem; font-weight: 800; margin-bottom: 20px; letter-spacing: -1px;}
    .footer-cta p { font-size: 1.4rem; color: var(--text-secondary); margin-bottom: 50px; }

    /* Animations */
    @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes fadeInDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

    @media (max-width: 1024px) {
      .hero-title { font-size: 3.5rem; }
      .circular-badge { display: none; }
      .hero-search-box { flex-direction: column; border-radius: var(--radius-lg); padding: 20px; gap: 15px; }
      .divider { width: 100%; height: 1px; margin: 0; }
      .search-btn { width: 100%; margin: 0; }
    }
  `]
})
export class LandingPageComponent implements OnInit {
  trendingJobs: Job[] = [];
  totalJobs = 0;

  constructor(private dataService: MockDataService) {}

  ngOnInit(): void {
    this.dataService.getJobs().subscribe(jobs => {
      this.totalJobs = jobs.length;
      this.trendingJobs = jobs.slice(0, 6);
    });
  }
}
