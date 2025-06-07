document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- Chatbot Functionality ---
    const chatDisplay = document.getElementById('chatDisplay');
    const chatInput = document.getElementById('chatInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');

    function addMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = message;
        chatDisplay.appendChild(messageDiv);
        chatDisplay.scrollTop = chatDisplay.scrollHeight; // Scroll to bottom
    }

    // Simple chatbot logic (you can expand this significantly)
    sendMessageBtn.addEventListener('click', () => {
        const userText = chatInput.value.trim();
        if (userText) {
            addMessage(userText, 'user');
            chatInput.value = '';

            // Simulate bot response
            setTimeout(() => {
                let botResponse = "Lo siento, no entendí tu pregunta. Por favor, reformula o consulta nuestra sección de Preguntas Frecuentes.";

                if (userText.toLowerCase().includes('contrato')) {
                    botResponse = "Un contrato de trabajo es un acuerdo entre un empleador y un empleado que establece los términos y condiciones del empleo. ¿Necesitas un modelo de contrato?";
                } else if (userText.toLowerCase().includes('liquidación') || userText.toLowerCase().includes('beneficios')) {
                    botResponse = "Para calcular tu liquidación, puedes usar nuestra 'Calculadora de Liquidación' en la sección correspondiente. Necesitarás tu sueldo, fecha de inicio y fin de labores.";
                } else if (userText.toLowerCase().includes('renuncia')) {
                    botResponse = "Si deseas renunciar, puedes descargar un modelo de carta de renuncia en nuestra sección 'Modelos Legales'. Recuerda presentarla con anticipación.";
                } else if (userText.toLowerCase().includes('premium') || userText.toLowerCase().includes('asesoría')) {
                    botResponse = "Con LegalWork Premium, obtienes asesoría legal personalizada, documentos a medida y acceso a funciones avanzadas. ¡Visita nuestra sección 'Premium' para más detalles!";
                } else if (userText.toLowerCase().includes('gracias')) {
                    botResponse = "De nada. Estoy aquí para ayudarte con tus derechos laborales.";
                }

                addMessage(botResponse, 'bot');
            }, 500);
        }
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessageBtn.click();
        }
    });

    // --- Calculator Functionality ---
    const calculateBtn = document.getElementById('calculateBtn');
    const salaryInput = document.getElementById('salary');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const hasCTSInput = document.getElementById('hasCTS');
    const hasVacationsInput = document.getElementById('hasVacations');
    const calculatorResults = document.getElementById('calculatorResults');

    const serviceTimeSpan = document.getElementById('serviceTime');
    const averageSalarySpan = document.getElementById('averageSalary');
    const vacationsAmountSpan = document.getElementById('vacationsAmount');
    const gratificationAmountSpan = document.getElementById('gratificationAmount');
    const ctsAmountSpan = document.getElementById('ctsAmount');
    const indemnizationAmountSpan = document.getElementById('indemnizationAmount');
    const totalLiquidationSpan = document.getElementById('totalLiquidation');

    calculateBtn.addEventListener('click', () => {
        const salary = parseFloat(salaryInput.value);
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);
        const hasCTS = hasCTSInput.checked;
        const hasVacations = hasVacationsInput.checked;

        if (isNaN(salary) || salary <= 0 || !startDate || !endDate || startDate >= endDate) {
            alert('Por favor, ingresa datos válidos para el sueldo y las fechas.');
            calculatorResults.style.display = 'none';
            return;
        }

        // Calculate time difference in months
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const totalMonths = diffDays / (365.25 / 12); // More accurate month calculation
        const fullMonths = Math.floor(totalMonths);
        const remainingDays = Math.round((totalMonths - fullMonths) * (365.25 / 12));

        serviceTimeSpan.textContent = `${fullMonths} meses y ${remainingDays} días`;
        averageSalarySpan.textContent = `S/ ${salary.toFixed(2)}`;

        let totalLiquidation = 0;
        let vacationsAmount = 0;
        let gratificationAmount = 0;
        let ctsAmount = 0;
        let indemnizationAmount = 0;

        // Simplified calculation logic (Peru labor law can be complex, this is a basic estimate)
        // 1. Vacaciones Truncas (proportional vacation pay for unused vacation)
        if (!hasVacations) {
            const monthsWorkedForVacation = totalMonths % 12; // Months since last vacation period or start
            vacationsAmount = (salary / 12) * monthsWorkedForVacation; // Example: 1 month of salary for 12 months worked, so 1/12 for each month.
        }

        // 2. Gratificaciones Truncas (proportional gratification pay)
        // Gratifications are usually paid in July and December, and are a full salary plus 9% bonus.
        // This calculates a proportional amount for the time worked within the current half-year period.
        const currentMonth = endDate.getMonth(); // 0 for Jan, 11 for Dec
        let monthsForGratification = 0;
        if (currentMonth >= 0 && currentMonth < 6) { // Jan-Jun period
            monthsForGratification = currentMonth + 1;
        } else { // Jul-Dec period
            monthsForGratification = currentMonth - 5;
        }
        gratificationAmount = (salary / 6) * monthsForGratification; // A gratification is typically a full salary for 6 months worked.

        // 3. CTS Trunca (proportional severance compensation)
        // CTS is usually deposited twice a year (May and November) and is equivalent to half a salary for 6 months worked.
        if (!hasCTS) {
            let monthsForCTS = 0;
            if (currentMonth >= 0 && currentMonth < 4) { // Nov-Apr period for May deposit
                monthsForCTS = currentMonth + 1 + (12 - 11); // months until April from Nov of previous year
            } else if (currentMonth >= 5 && currentMonth < 10) { // May-Oct period for Nov deposit
                monthsForCTS = currentMonth + 1 - 5; // months until October from May
            }
            ctsAmount = (salary / 12) * monthsForCTS; // Approximately (salary + 1/6 salary for family bonus) / 12 * months
        }

        // 4. Indemnización por despido arbitrario (arbitrary dismissal severance) - Highly simplified example
        // This is complex and depends on type of contract, cause of dismissal, etc.
        // As a *very basic* placeholder, if dismissed arbitrarily, it's often 1.5 salaries per year worked, capped.
        // This example assumes arbitrary dismissal for a contract that was supposed to be indefinite.
        indemnizationAmount = 0; // Default to 0, it's a specific case
        // If you were to add a checkbox "Despido Arbitrario", then:
        // if (isArbitraryDismissalCheckbox.checked) {
        //     indemnizationAmount = (salary / 12) * 1.5 * fullMonths; // 1.5 salaries per year worked
        // }


        totalLiquidation = vacationsAmount + gratificationAmount + ctsAmount + indemnizationAmount;

        vacationsAmountSpan.textContent = vacationsAmount.toFixed(2);
        gratificationAmountSpan.textContent = gratificationAmount.toFixed(2);
        ctsAmountSpan.textContent = ctsAmount.toFixed(2);
        indemnizationAmountSpan.textContent = indemnizationAmount.toFixed(2); // Display 0.00 if no indemnization
        totalLiquidationSpan.textContent = totalLiquidation.toFixed(2);

        calculatorResults.style.display = 'block'; // Show results
    });

    // --- Modal Functionality (Login/Register) ---
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const btnLogin = document.querySelector('.btn-login');
    const btnStart = document.querySelector('.btn-start'); // If 'Comenzar' leads to register
    const closeButtons = document.querySelectorAll('.modal .close-button');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');

    function openModal(modal) {
        modal.style.display = 'flex'; // Use flex to center
    }

    function closeModal(modal) {
        modal.style.display = 'none';
    }

    btnLogin.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(loginModal);
    });

    // Assuming 'Comenzar' might lead to registration or a general welcome.
    // If it's specifically for registration, change this:
    if (btnStart) {
        btnStart.addEventListener('click', (e) => {
            e.preventDefault();
            // Decide if 'Comenzar' opens register or just scrolls to hero
            // For now, let's make it open register for demo purposes.
            openModal(registerModal);
        });
    }


    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            closeModal(e.target.closest('.modal'));
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            closeModal(loginModal);
        }
        if (e.target === registerModal) {
            closeModal(registerModal);
        }
    });

    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(loginModal);
        openModal(registerModal);
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(registerModal);
        openModal(loginModal);
    });

    // Basic form submission handling (for prototype, just log)
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Intento de inicio de sesión. (En un entorno real, aquí iría la validación del backend)');
        console.log('Login attempt:', {
            email: document.getElementById('loginEmail').value,
            password: '***' // Never log real passwords
        });
        closeModal(loginModal);
    });

    document.getElementById('registerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden.');
            return;
        }
        alert('Intento de registro. (En un entorno real, aquí iría la validación del backend)');
        console.log('Register attempt:', {
            name: document.getElementById('registerName').value,
            email: document.getElementById('registerEmail').value,
            password: '***'
        });
        closeModal(registerModal);
    });

    // Placeholder for model downloads
    // You would serve these files from your 'models' directory.
    // For premium models, you'd integrate with your authentication/subscription logic.
    document.querySelectorAll('.model-item .btn-download.disabled').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Este modelo es exclusivo para usuarios Premium. ¡Suscríbete para descargarlo!');
        });
    });
});
