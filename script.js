// Smooth scrolling to contacts
function scrollToContacts() {
  const contactsSection = document.getElementById("contacts")
  const headerHeight = document.querySelector(".header-new").offsetHeight || 80
  const targetPosition = contactsSection.offsetTop - headerHeight - 20

  window.scrollTo({
    top: targetPosition,
    behavior: "smooth",
  })
}

// Animated counters for stats
function animateCounters() {
  const counters = document.querySelectorAll(".stat-number")

  counters.forEach((counter) => {
    const target = Number.parseInt(counter.getAttribute("data-target"))
    const increment = target / 100
    let current = 0

    const updateCounter = () => {
      if (current < target) {
        current += increment
        counter.textContent = Math.floor(current)
        setTimeout(updateCounter, 20)
      } else {
        counter.textContent = target
      }
    }

    updateCounter()
  })
}

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible")

      // Trigger counter animation for stats section
      if (entry.target.classList.contains("stats")) {
        animateCounters()
      }
    }
  })
}, observerOptions)

// Mobile menu functionality
function initMobileMenu() {
  const nav = document.querySelector(".nav")
  const navToggle = document.createElement("button")
  navToggle.innerHTML = "☰"
  navToggle.className = "nav-toggle"
  navToggle.setAttribute("aria-label", "Відкрити меню")
  navToggle.setAttribute("aria-expanded", "false")

  // Insert toggle button
  document.querySelector(".header-content").insertBefore(navToggle, nav)

  // Toggle mobile menu
  navToggle.addEventListener("click", () => {
    const isActive = nav.classList.toggle("active")
    navToggle.setAttribute("aria-expanded", isActive.toString())
    navToggle.innerHTML = isActive ? "✕" : "☰"

    // Prevent body scroll when menu is open
    document.body.style.overflow = isActive ? "hidden" : ""
  })

  // Close mobile menu when clicking on links
  nav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      nav.classList.remove("active")
      navToggle.setAttribute("aria-expanded", "false")
      navToggle.innerHTML = "☰"
      document.body.style.overflow = ""
    }
  })

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
      nav.classList.remove("active")
      navToggle.setAttribute("aria-expanded", "false")
      navToggle.innerHTML = "☰"
      document.body.style.overflow = ""
    }
  })

  // Close menu on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("active")) {
      nav.classList.remove("active")
      navToggle.setAttribute("aria-expanded", "false")
      navToggle.innerHTML = "☰"
      document.body.style.overflow = ""
      navToggle.focus()
    }
  })
}

// Touch-friendly gallery
function initGallery() {
  const galleryItems = document.querySelectorAll(".gallery-item img")

  galleryItems.forEach((img, index) => {
    img.addEventListener("click", () => {
      createLightbox(img, index, galleryItems)
    })

    // Add keyboard support
    img.setAttribute("tabindex", "0")
    img.setAttribute("role", "button")
    img.setAttribute("aria-label", `Переглянути зображення ${index + 1}`)

    img.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        createLightbox(img, index, galleryItems)
      }
    })
  })
}

function createLightbox(img, currentIndex, allImages) {
  const lightbox = document.createElement("div")
  lightbox.className = "lightbox"
  lightbox.setAttribute("role", "dialog")
  lightbox.setAttribute("aria-label", "Перегляд зображення")

  lightbox.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    padding: 20px;
    box-sizing: border-box;
  `

  const lightboxContent = document.createElement("div")
  lightboxContent.style.cssText = `
    position: relative;
    max-width: 90%;
    max-height: 90%;
    display: flex;
    align-items: center;
    justify-content: center;
  `

  const lightboxImg = document.createElement("img")
  lightboxImg.src = img.src
  lightboxImg.alt = img.alt
  lightboxImg.style.cssText = `
    max-width: 100%;
    max-height: 100%;
    border-radius: 10px;
    object-fit: contain;
  `

  const closeBtn = document.createElement("button")
  closeBtn.innerHTML = "✕"
  closeBtn.setAttribute("aria-label", "Закрити")
  closeBtn.style.cssText = `
    position: absolute;
    top: -40px;
    right: 0;
    background: rgba(255,255,255,0.2);
    border: none;
    color: white;
    font-size: 24px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  `

  // Navigation buttons for mobile
  if (allImages.length > 1) {
    const prevBtn = document.createElement("button")
    prevBtn.innerHTML = "‹"
    prevBtn.setAttribute("aria-label", "Попереднє зображення")
    prevBtn.style.cssText = `
      position: absolute;
      left: -50px;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255,255,255,0.2);
      border: none;
      color: white;
      font-size: 30px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    `

    const nextBtn = document.createElement("button")
    nextBtn.innerHTML = "›"
    nextBtn.setAttribute("aria-label", "Наступне зображення")
    nextBtn.style.cssText = `
      position: absolute;
      right: -50px;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255,255,255,0.2);
      border: none;
      color: white;
      font-size: 30px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    `

    // Navigation functionality
    let currentIdx = currentIndex

    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      currentIdx = currentIdx > 0 ? currentIdx - 1 : allImages.length - 1
      lightboxImg.src = allImages[currentIdx].src
      lightboxImg.alt = allImages[currentIdx].alt
    })

    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      currentIdx = currentIdx < allImages.length - 1 ? currentIdx + 1 : 0
      lightboxImg.src = allImages[currentIdx].src
      lightboxImg.alt = allImages[currentIdx].alt
    })

    lightboxContent.appendChild(prevBtn)
    lightboxContent.appendChild(nextBtn)

    // Keyboard navigation
    lightbox.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        prevBtn.click()
      } else if (e.key === "ArrowRight") {
        nextBtn.click()
      }
    })
  }

  lightboxContent.appendChild(lightboxImg)
  lightboxContent.appendChild(closeBtn)
  lightbox.appendChild(lightboxContent)

  // Close functionality
  const closeLightbox = () => {
    document.body.removeChild(lightbox)
    document.body.style.overflow = ""
    img.focus() // Return focus to original image
  }

  closeBtn.addEventListener("click", closeLightbox)
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox()
    }
  })

  // Keyboard support
  lightbox.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeLightbox()
    }
  })

  document.body.appendChild(lightbox)
  document.body.style.overflow = "hidden"

  // Focus management
  closeBtn.focus()

  // Touch gestures for mobile
  let startX = 0
  let startY = 0

  lightbox.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX
    startY = e.touches[0].clientY
  })

  lightbox.addEventListener("touchend", (e) => {
    if (!startX || !startY) return

    const endX = e.changedTouches[0].clientX
    const endY = e.changedTouches[0].clientY
    const diffX = startX - endX
    const diffY = startY - endY

    // Swipe detection
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0 && allImages.length > 1) {
        // Swipe left - next image
        const nextBtn = lightboxContent.querySelector("button[aria-label='Наступне зображення']")
        if (nextBtn) nextBtn.click()
      } else if (diffX < 0 && allImages.length > 1) {
        // Swipe right - previous image
        const prevBtn = lightboxContent.querySelector("button[aria-label='Попереднє зображення']")
        if (prevBtn) prevBtn.click()
      }
    }

    startX = 0
    startY = 0
  })
}

// Form validation and submission
function initContactForm() {
  const form = document.getElementById("contactForm")
  const inputs = form.querySelectorAll("input, select, textarea")

  // Add real-time validation
  inputs.forEach((input) => {
    input.addEventListener("blur", validateField)
    input.addEventListener("input", clearErrors)
  })

  form.addEventListener("submit", (e) => {
    e.preventDefault()

    // Validate all fields
    let isValid = true
    inputs.forEach((input) => {
      if (!validateField({ target: input })) {
        isValid = false
      }
    })

    if (isValid) {
      // Show loading state
      const submitBtn = form.querySelector("button[type='submit']")
      const originalText = submitBtn.textContent
      submitBtn.textContent = "Відправляємо..."
      submitBtn.disabled = true

      // Simulate form submission
      setTimeout(() => {
        alert("Дякуємо за вашу заявку! Ми зв'яжемося з вами найближчим часом.")
        form.reset()
        submitBtn.textContent = originalText
        submitBtn.disabled = false

        // Clear all error states
        inputs.forEach((input) => {
          clearErrors({ target: input })
        })
      }, 1500)
    }
  })
}

function validateField(e) {
  const field = e.target
  const value = field.value.trim()
  let isValid = true

  // Remove existing error
  clearErrors(e)

  // Required field validation
  if (field.hasAttribute("required") && !value) {
    showError(field, "Це поле обов'язкове для заповнення")
    isValid = false
  }

  // Email validation
  if (field.type === "email" && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      showError(field, "Введіть коректну email адресу")
      isValid = false
    }
  }

  // Phone validation
  if (field.type === "tel" && value) {
    const phoneRegex = /^[+]?[0-9\s\-$$$$]{10,}$/
    if (!phoneRegex.test(value)) {
      showError(field, "Введіть коректний номер телефону")
      isValid = false
    }
  }

  return isValid
}

function showError(field, message) {
  field.style.borderColor = "#f44336"

  let errorDiv = field.parentNode.querySelector(".error-message")
  if (!errorDiv) {
    errorDiv = document.createElement("div")
    errorDiv.className = "error-message"
    errorDiv.style.cssText = `
      color: #f44336;
      font-size: 0.8rem;
      margin-top: 0.25rem;
    `
    field.parentNode.appendChild(errorDiv)
  }
  errorDiv.textContent = message
}

function clearErrors(e) {
  const field = e.target
  field.style.borderColor = "#eee"

  const errorDiv = field.parentNode.querySelector(".error-message")
  if (errorDiv) {
    errorDiv.remove()
  }
}

// Header scroll effect
function initHeaderScroll() {
  let lastScrollY = window.scrollY
  const header = document.querySelector(".header")

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY

    // Change header background
    if (currentScrollY > 100) {
      header.style.background = "rgba(255, 255, 255, 0.95)"
      header.style.backdropFilter = "blur(10px)"
    } else {
      header.style.background = "#fff"
      header.style.backdropFilter = "none"
    }

    // Hide/show header on scroll (mobile)
    if (window.innerWidth <= 768) {
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        header.style.transform = "translateY(-100%)"
      } else {
        // Scrolling up
        header.style.transform = "translateY(0)"
      }
    }

    lastScrollY = currentScrollY
  })
}

// Mobile menu functionality for new header
function initNewMobileMenu() {
  const nav = document.querySelector(".nav-new")
  const navToggle = document.createElement("button")
  navToggle.innerHTML = "☰"
  navToggle.className = "nav-toggle-new"
  navToggle.setAttribute("aria-label", "Відкрити меню")
  navToggle.setAttribute("aria-expanded", "false")

  // Insert toggle button
  document.querySelector(".header-content-new").insertBefore(navToggle, nav)

  // Toggle mobile menu
  navToggle.addEventListener("click", () => {
    const isActive = nav.classList.toggle("active")
    navToggle.setAttribute("aria-expanded", isActive.toString())
    navToggle.innerHTML = isActive ? "✕" : "☰"

    // Prevent body scroll when menu is open
    document.body.style.overflow = isActive ? "hidden" : ""
  })

  // Close mobile menu when clicking on links
  nav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      nav.classList.remove("active")
      navToggle.setAttribute("aria-expanded", "false")
      navToggle.innerHTML = "☰"
      document.body.style.overflow = ""
    }
  })

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
      nav.classList.remove("active")
      navToggle.setAttribute("aria-expanded", "false")
      navToggle.innerHTML = "☰"
      document.body.style.overflow = ""
    }
  })

  // Close menu on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("active")) {
      nav.classList.remove("active")
      navToggle.setAttribute("aria-expanded", "false")
      navToggle.innerHTML = "☰"
      document.body.style.overflow = ""
      navToggle.focus()
    }
  })
}

// Category buttons functionality
function initCategoryButtons() {
  const categoryButtons = document.querySelectorAll(".category-btn")

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.getAttribute("data-target")

      // Scroll to courses section
      const coursesSection = document.getElementById("courses")
      if (coursesSection) {
        const headerHeight = document.querySelector(".header-new").offsetHeight || 80
        const targetPosition = coursesSection.offsetTop - headerHeight - 20

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })

        // Activate the corresponding course tab after scrolling
        setTimeout(() => {
          const targetTab = document.querySelector(`[data-target="${target}"]`)
          if (targetTab && targetTab.classList.contains("nav-item")) {
            targetTab.click()
          }
        }, 800)
      }
    })

    // Keyboard support
    button.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        button.click()
      }
    })
  })
}

// Header scroll effect for new header
function initNewHeaderScroll() {
  let lastScrollY = window.scrollY
  const header = document.querySelector(".header-new")

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY

    // Change header background and shadow
    if (currentScrollY > 50) {
      header.style.background = "rgba(255, 255, 255, 0.95)"
      header.style.backdropFilter = "blur(15px)"
      header.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.12)"
    } else {
      header.style.background = "#fff"
      header.style.backdropFilter = "none"
      header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.08)"
    }

    // Hide/show header on scroll (mobile)
    if (window.innerWidth <= 768) {
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        header.style.transform = "translateY(-100%)"
      } else {
        // Scrolling up
        header.style.transform = "translateY(0)"
      }
    }

    lastScrollY = currentScrollY
  })
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        const headerHeight = document.querySelector(".header-new").offsetHeight || 80
        const targetPosition = target.offsetTop - headerHeight - 20

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  })
}

// Courses navigation functionality
function initCoursesNavigation() {
  const navItems = document.querySelectorAll(".nav-item")
  const courseGroups = document.querySelectorAll(".course-group")

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      // Remove active class from all nav items
      navItems.forEach((nav) => {
        nav.classList.remove("active")
        nav.setAttribute("aria-pressed", "false")
      })

      // Add active class to clicked item
      item.classList.add("active")
      item.setAttribute("aria-pressed", "true")

      // Hide all course groups
      courseGroups.forEach((group) => {
        group.classList.remove("active")
      })

      // Show target course group
      const target = item.getAttribute("data-target")
      const targetGroup = document.getElementById(target)
      if (targetGroup) {
        targetGroup.classList.add("active")
      }
    })

    // Keyboard support
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        item.click()
      }
    })
  })
}

// Language courses tabs functionality
function initLanguageTabs() {
  const languageTabs = document.querySelectorAll(".language-tab")
  const languageItems = document.querySelectorAll(".language-item")

  languageTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs
      languageTabs.forEach((t) => {
        t.classList.remove("active")
        t.setAttribute("aria-pressed", "false")
      })

      // Add active class to clicked tab
      tab.classList.add("active")
      tab.setAttribute("aria-pressed", "true")

      // Hide all language items
      languageItems.forEach((item) => {
        item.classList.remove("active")
      })

      // Show target language item
      const target = tab.getAttribute("data-lang")
      const targetItem = document.getElementById(target)
      if (targetItem) {
        targetItem.classList.add("active")
      }
    })

    // Keyboard support
    tab.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        tab.click()
      }

      // Arrow key navigation
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault()
        const tabs = Array.from(languageTabs)
        const currentIndex = tabs.indexOf(tab)
        let nextIndex

        if (e.key === "ArrowLeft") {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1
        } else {
          nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0
        }

        tabs[nextIndex].focus()
        tabs[nextIndex].click()
      }
    })
  })

  // Touch swipe support for mobile
  let startX = 0
  let startY = 0

  const languageContent = document.querySelector(".language-content")

  languageContent.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX
    startY = e.touches[0].clientY
  })

  languageContent.addEventListener("touchend", (e) => {
    if (!startX || !startY) return

    const endX = e.changedTouches[0].clientX
    const endY = e.changedTouches[0].clientY
    const diffX = startX - endX
    const diffY = startY - endY

    // Only handle horizontal swipes
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      const activeTab = document.querySelector(".language-tab.active")
      const tabs = Array.from(languageTabs)
      const currentIndex = tabs.indexOf(activeTab)

      if (diffX > 0 && currentIndex < tabs.length - 1) {
        // Swipe left - next tab
        tabs[currentIndex + 1].click()
      } else if (diffX < 0 && currentIndex > 0) {
        // Swipe right - previous tab
        tabs[currentIndex - 1].click()
      }
    }

    startX = 0
    startY = 0
  })
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Add fade-in class to sections and observe them
  const sections = document.querySelectorAll("section")
  sections.forEach((section) => {
    section.classList.add("fade-in")
    observer.observe(section)
  })

  // Initialize all functionality
  initNewMobileMenu() // Updated function name
  initGallery()
  initContactForm()
  initNewHeaderScroll() // Updated function name
  initSmoothScrolling()

  // Add courses navigation initialization
  initCoursesNavigation()

  // Add language tabs initialization
  initLanguageTabs()

  // Add category buttons initialization
  initCategoryButtons()

  // Add loading class removal
  window.addEventListener("load", () => {
    document.body.classList.remove("loading")
  })

  // Add resize handler for responsive adjustments
  let resizeTimer
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      // Reset mobile menu on resize
      const nav = document.querySelector(".nav-new")
      const navToggle = document.querySelector(".nav-toggle-new")
      if (window.innerWidth > 768 && nav && nav.classList.contains("active")) {
        nav.classList.remove("active")
        if (navToggle) {
          navToggle.setAttribute("aria-expanded", "false")
          navToggle.innerHTML = "☰"
        }
        document.body.style.overflow = ""
      }
    }, 250)
  })

  initHeaderNavigation()
})

function initHeaderNavigation() {
  const headerLinks = document.querySelectorAll('.nav-new a[href^="#"]')

  headerLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href")
      const target = document.querySelector(targetId)

      if (target) {
        const headerHeight = document.querySelector(".header-new").offsetHeight || 80
        const targetPosition = target.offsetTop - headerHeight - 20

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })

        // Close mobile menu if open
        const nav = document.querySelector(".nav-new")
        const navToggle = document.querySelector(".nav-toggle-new")
        if (nav && nav.classList.contains("active")) {
          nav.classList.remove("active")
          if (navToggle) {
            navToggle.setAttribute("aria-expanded", "false")
            navToggle.innerHTML = "☰"
          }
          document.body.style.overflow = ""
        }
      }
    })
  })
}

// Service Worker registration for better mobile performance
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}
