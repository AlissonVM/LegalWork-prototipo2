// --- Funcionalidad de Modales (Login/Register) ---
document.addEventListener('DOMContentLoaded', () => {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const btnLogin = document.querySelector('.btn-login');
    const closeButtons = document.querySelectorAll('.close-button');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');

    function openModal(modal) {
        modal.style.display = 'flex'; // Usamos flex para centrar el contenido
        document.body.style.overflow = 'hidden'; // Evita scroll en el body
    }

    function closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restaura el scroll
    }

    if (btnLogin) {
        btnLogin.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(loginModal);
        });
    }

    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            closeModal(loginModal);
            closeModal(registerModal);
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

    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(loginModal);
            openModal(registerModal);
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(registerModal);
            openModal(loginModal);
        });
    }

    // Opcional: Manejo de envío de formularios (ejemplo básico)
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Intento de inicio de sesión. (Funcionalidad no implementada)');
            closeModal(loginModal);
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden.');
                return;
            }
            alert('Intento de registro. (Funcionalidad no implementada)');
            closeModal(registerModal);
        });
    }

    // --- Funcionalidad del Chatbot ---
    const chatInput = document.getElementById('chatInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const chatDisplay = document.getElementById('chatDisplay');

    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
        messageElement.textContent = text;
        chatDisplay.appendChild(messageElement);
        chatDisplay.scrollTop = chatDisplay.scrollHeight; // Auto-scroll
    }

    // Asegurarse de que los elementos existen antes de añadir listeners
    if (sendMessageBtn && chatInput && chatDisplay) {
        sendMessageBtn.addEventListener('click', () => {
            const messageText = chatInput.value.trim();
            if (messageText) {
                addMessage(messageText, 'user');
                chatInput.value = '';
                // Simulación de respuesta del bot
                setTimeout(() => {
                    addMessage("Gracias por tu pregunta. Soy un asistente demostrativo. Para asesoría real, usa nuestros servicios Premium.", 'bot');
                }, 1000);
            }
        });

        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessageBtn.click();
            }
        });
    }

    // --- Funcionalidad de la Calculadora de Liquidación ---
    const calculateBtn = document.getElementById('calculateBtn');
    const calculatorResults = document.getElementById('calculatorResults');

    if (calculateBtn && calculatorResults) { // Asegurarse de que ambos elementos existan
        calculateBtn.addEventListener('click', () => {
            const salary = parseFloat(document.getElementById('salary').value);
            const hasFamilyAllowance = document.getElementById('hasFamilyAllowance').checked;
            const startDate = new Date(document.getElementById('startDate').value);
            const endDate = new Date(document.getElementById('endDate').value);
            const workType = document.getElementById('workType').value;
            const hasCTS = document.getElementById('hasCTS').checked;
            const hasVacations = document.getElementById('hasVacations').checked;

            // Validaciones básicas
            if (isNaN(salary) || salary <= 0 || !document.getElementById('startDate').value || !document.getElementById('endDate').value || startDate >= endDate) {
                alert('Por favor, ingresa datos válidos para el cálculo (salario, fechas de inicio y fin).');
                calculatorResults.style.display = 'none'; // Ocultar resultados si hay error
                return;
            }

            const MS_PER_DAY = 1000 * 60 * 60 * 24;
            
            // Función para calcular la diferencia de meses y días entre dos fechas
            function getMonthsAndDays(d1, d2) {
                let year1 = d1.getFullYear();
                let month1 = d1.getMonth();
                let day1 = d1.getDate();

                let year2 = d2.getFullYear();
                let month2 = d2.getMonth();
                let day2 = d2.getDate();

                let years = year2 - year1;
                let months = month2 - month1;
                let days = day2 - day1;

                if (days < 0) {
                    months--;
                    let prevMonth = new Date(year2, month2, 0);
                    days += prevMonth.getDate();
                }

                if (months < 0) {
                    years--;
                    months += 12;
                }
                return { years, months, days };
            }

            const { years, months, days } = getMonthsAndDays(startDate, endDate);
            const totalMonthsCalculated = years * 12 + months; // Meses completos
            const remainingDays = days; // Días restantes después de los meses completos

            let serviceTimeString = '';
            if (years > 0) serviceTimeString += `${years} año(s) `;
            if (months > 0) serviceTimeString += `${months} mes(es) `;
            if (remainingDays > 0) serviceTimeString += `${remainingDays} día(s)`;
            if (serviceTimeString === '') serviceTimeString = 'Menos de un día';

            document.getElementById('serviceTime').textContent = serviceTimeString.trim();

            // Remuneración Computable (RC)
            const familyAllowance = hasFamilyAllowance ? 102.50 : 0; // Valor de asignación familiar en Perú
            const remunerationComputable = salary + familyAllowance;
            document.getElementById('baseSalary').textContent = remunerationComputable.toFixed(2);

            let totalLiquidation = 0;
            let ctsAmount = 0;
            let gratificationAmount = 0;
            let vacationsAmount = 0;
            let indemnizationAmount = 0;

            // Cálculo de Vacaciones Truncas
            // Proporcional al tiempo trabajado (desde el último goce o inicio de contrato)
            // 1/12 de la RC por cada mes completo trabajado
            if (!hasVacations) {
                // Meses completos desde inicio o último goce
                vacationsAmount = (remunerationComputable / 12) * totalMonthsCalculated;
                // Días proporcionales
                vacationsAmount += (remunerationComputable / 360) * remainingDays; // Suponemos 360 días en un año para cálculo diario
            }

            // Cálculo de Gratificaciones Truncas (Julio y Diciembre)
            // 1/6 de la RC por cada mes completo trabajado en el semestre correspondiente
            // Asumiendo que se calcula al cese.
            let monthsForGratification = 0;
            const endMonthIndex = endDate.getMonth(); // 0 = Enero, 11 = Diciembre

            if (endMonthIndex >= 0 && endMonthIndex <= 5) { // Periodo Enero-Junio
                const periodStart = new Date(endDate.getFullYear(), 0, 1);
                const { months: currentMonths, days: currentDays } = getMonthsAndDays(periodStart, endDate);
                monthsForGratification = currentMonths;
                if (currentDays > 0) monthsForGratification++; // Si hay días en el último mes, se considera mes completo
            } else if (endMonthIndex >= 6 && endMonthIndex <= 11) { // Periodo Julio-Diciembre
                const periodStart = new Date(endDate.getFullYear(), 6, 1);
                const { months: currentMonths, days: currentDays } = getMonthsAndDays(periodStart, endDate);
                monthsForGratification = currentMonths;
                if (currentDays > 0) monthsForGratification++; // Si hay días en el último mes, se considera mes completo
            }
            
            // La gratificación es la RC más el 9% de EsSalud para trabajadores del régimen privado.
            // Aquí simplificaremos a solo la RC para dar un monto aproximado de lo que le correspondería "neto".
            if (monthsForGratification > 0) {
                 gratificationAmount = (salary / 6) * monthsForGratification;
            }

            // Cálculo de CTS Trunca
            // Se acumula a razón de 1/12 de la RC por cada mes calendario completo de servicios.
            // Para la CTS, la RC es diferente (sueldo + 1/6 gratif. + asig. familiar)
            // Simplificaremos la RC para CTS a (Sueldo + Asignación Familiar + (Sueldo/6 si aplica)).
            // Para este cálculo rápido, usaremos la `remunerationComputable` que ya incluye Asignación.
            if (!hasCTS) {
                // Se considera la remuneración computable + 1/6 de gratificación.
                // Para simplificar, asumiremos que la `remunerationComputable` que ya calculamos es la base.
                // Fórmula: (RC / 12) por meses completos + (RC / 360) por días
                ctsAmount = (remunerationComputable / 12) * totalMonthsCalculated + (remunerationComputable / 360) * remainingDays;
            }
            
            // Cálculo de Indemnización por Despido Arbitrario (Estimado simplificado)
            // 1.5 remuneraciones por cada año completo de servicio, con un tope de 12 remuneraciones.
            // Aplica para contratos a plazo indeterminado y despido sin causa justificada.
            // Se considera la RC (que es sueldo + asignación familiar si aplica).
            if (workType === 'full-time' && totalMonthsCalculated >= 3) { // Mínimo 3 meses para estabilidad relativa
                indemnizationAmount = 1.5 * remunerationComputable * years; // Años completos
                // Tope: 12 remuneraciones computables
                if (indemnizationAmount > (12 * remunerationComputable)) {
                    indemnizationAmount = 12 * remunerationComputable;
                }
            } else {
                 indemnizationAmount = 0; // No aplica o es otro tipo de contrato/duración
            }


            totalLiquidation = (vacationsAmount + gratificationAmount + ctsAmount + indemnizationAmount);

            document.getElementById('vacationsAmount').textContent = vacationsAmount.toFixed(2);
            document.getElementById('gratificationAmount').textContent = gratificationAmount.toFixed(2);
            document.getElementById('ctsAmount').textContent = ctsAmount.toFixed(2);
            document.getElementById('indemnizationAmount').textContent = indemnizationAmount.toFixed(2);
            document.getElementById('totalLiquidation').textContent = totalLiquidation.toFixed(2);

            calculatorResults.style.display = 'block'; // Muestra los resultados
        });
    }

    // --- Enlaces del Header: Scroll Suave ---
    document.querySelectorAll('.main-nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#') && href !== '#registerModal' && href !== '#loginModal') { // Excluir #registerModal y #loginModal
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});
