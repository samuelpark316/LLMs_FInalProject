# ✅ Pre-Demo Checklist

Use this checklist to ensure everything is ready for your presentation.

---

## 📋 30 Minutes Before Demo

### System Setup
- [ ] Computer is fully charged (or plugged in)
- [ ] Close all unnecessary applications
- [ ] Turn off notifications (Do Not Disturb mode)
- [ ] Clear browser history/cache if needed
- [ ] Set screen brightness to comfortable level
- [ ] Disable screensaver/sleep mode

### Application Setup
- [ ] Navigate to project directory
- [ ] Run `npm install` (if not already done)
- [ ] Start dev server: `npm run dev`
- [ ] Verify server starts without errors
- [ ] Open http://localhost:3000 in browser
- [ ] Test that application loads correctly

### Functionality Check
- [ ] #project-alpha channel is pre-selected
- [ ] All 15 messages load correctly
- [ ] Can scroll through message feed
- [ ] "Summarize Channel" button is visible
- [ ] Click summarize button - modal opens
- [ ] AI summary displays correctly (after 1.5s)
- [ ] Can close modal with X button
- [ ] Can close modal with ESC key
- [ ] Can send a test message
- [ ] Message appears instantly (optimistic update)
- [ ] Can switch to #general channel
- [ ] Sidebar is visible on desktop
- [ ] No console errors (F12 → Console tab)

### Responsive Design Check
- [ ] Open DevTools (F12)
- [ ] Toggle device toolbar (Ctrl+Shift+M)
- [ ] Test on iPhone view (375px width)
- [ ] Hamburger menu appears
- [ ] Click hamburger - sidebar slides in
- [ ] Click channel - sidebar closes
- [ ] Test on tablet view (768px width)
- [ ] Test on desktop view (1024px+)
- [ ] Close DevTools

### Documentation Ready
- [ ] DEMO_SCRIPT.md is open in another tab/window
- [ ] Can quickly reference script during demo
- [ ] DEPLOYMENT.md ready to show roadmap
- [ ] Code editor open (VS Code) with project
- [ ] Can show project structure if asked

---

## 📋 10 Minutes Before Demo

### Browser Setup
- [ ] Browser zoom is at 100%
- [ ] Only demo-related tabs are open
- [ ] Bookmark bar hidden (for cleaner look)
- [ ] Clear any form autofill popups
- [ ] Test one more complete flow

### Physical Setup
- [ ] Water nearby (stay hydrated!)
- [ ] Comfortable seating/standing position
- [ ] Screen is visible to audience
- [ ] Projector/screen sharing is working (if remote)
- [ ] Microphone is working (if presenting remotely)

### Mental Preparation
- [ ] Review key talking points from DEMO_SCRIPT.md
- [ ] Practice opening line
- [ ] Deep breath - you've got this!
- [ ] Remember: you built something impressive

---

## 📋 During Demo (Quick Reference)

### Part 1: Problem (1 min)
- [ ] Show #project-alpha channel
- [ ] Scroll through 15+ messages
- [ ] Emphasize information overload

### Part 2: Solution (2 min)
- [ ] Click "Summarize Channel"
- [ ] Wait for loading animation (1.5s)
- [ ] Walk through summary sections
- [ ] Point at specific insights

### Part 3: Experience (1 min)
- [ ] Close modal
- [ ] Send test message
- [ ] Switch to #general
- [ ] Show responsive design (mobile view)

### Part 4: Vision (1 min)
- [ ] Explain production roadmap
- [ ] Show DEPLOYMENT.md briefly
- [ ] Discuss market positioning

### Part 5: Closing (30s)
- [ ] Recap key points
- [ ] Open for questions

---

## 📋 Common Issues & Quick Fixes

### Issue: Server won't start
**Fix**:
```bash
npx kill-port 3000
npm run dev
```

### Issue: Page won't load
**Fix**:
- Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R)
- Clear cache and reload

### Issue: Messages not showing
**Fix**:
- Check console for errors (F12)
- Verify mock data is loaded
- Restart dev server

### Issue: Modal won't open
**Fix**:
- Check for JavaScript errors
- Verify button is clickable
- Restart dev server

### Issue: Responsive view broken
**Fix**:
- Close and reopen DevTools
- Reset device toolbar settings
- Test in actual mobile browser

---

## 📋 Q&A Preparation

### Technical Questions Ready
- [ ] "Is the AI real?" → Yes, using pre-written for demo; OpenAI for production
- [ ] "Can it scale?" → Yes, show Supabase architecture
- [ ] "What about mobile?" → Show responsive design
- [ ] "How do you deploy?" → Vercel one-click deployment

### Business Questions Ready
- [ ] "Who's the customer?" → Mid-size teams (50-500 people)
- [ ] "How do you make money?" → Freemium SaaS model
- [ ] "Why not just use Slack?" → Simpler + AI-first approach
- [ ] "What's the timeline?" → Beta in 1 month, production in 3

### Demo Backup Plan
- [ ] Screenshots saved (in case of technical issues)
- [ ] Video recording of perfect run (if possible)
- [ ] Graceful pivot script prepared

---

## 📋 Post-Demo

### Immediate
- [ ] Thank the audience
- [ ] Collect feedback
- [ ] Answer questions thoroughly
- [ ] Share GitHub/demo link if requested

### Follow-up (Within 24 hours)
- [ ] Send demo recording (if recorded)
- [ ] Share documentation links
- [ ] Respond to additional questions
- [ ] Incorporate feedback into notes

### Reflection
- [ ] What went well?
- [ ] What could be improved?
- [ ] Any technical issues to fix?
- [ ] Ideas for next iteration

---

## 📋 Confidence Boosters

### Remember These Wins
✅ You built a production-ready application  
✅ You have comprehensive documentation  
✅ You understand the entire architecture  
✅ You've practiced the demo  
✅ You have a clear vision for the product  

### If You Get Nervous
1. Take a deep breath
2. Remember: you're showing something you built
3. The audience wants you to succeed
4. Even if something breaks, you have documentation
5. Your preparation speaks for itself

### If Something Goes Wrong
1. Stay calm and confident
2. Acknowledge the issue gracefully
3. Use backup screenshots/video
4. Pivot to documentation
5. Explain what should happen

---

## 📋 Success Metrics

### You Did Great If:
✅ Audience understands the value proposition  
✅ Demo runs smoothly (or you recover well)  
✅ Questions show genuine interest  
✅ People ask "can I try this?"  
✅ You feel confident about your work  

---

## 🎉 Final Reminders

1. **Breathe**: You've prepared thoroughly
2. **Smile**: Your enthusiasm is contagious
3. **Slow Down**: 5 minutes is plenty of time
4. **Make Eye Contact**: Connect with your audience
5. **Be Proud**: You built something impressive

---

## 📞 Emergency Contacts

### If Demo Environment Fails

**Plan A**: Use local development server (current setup)  
**Plan B**: Use screenshots from `slack-mvp/assets/` (if created)  
**Plan C**: Use video recording of perfect run  
**Plan D**: Live-code a component to show expertise  

### Technical Support
- DevTools Console (F12) for debugging
- [QUICKSTART.md](./QUICKSTART.md) for setup issues
- [DEMO_SCRIPT.md](./DEMO_SCRIPT.md) for talking points

---

## ✨ You're Ready!

You've built an impressive project, documented it thoroughly, and prepared a great demo.

**Trust your preparation. Trust your work. Trust yourself.**

# Break a leg! 🎉🚀

---

*Print this checklist and keep it nearby during your demo for quick reference.*

