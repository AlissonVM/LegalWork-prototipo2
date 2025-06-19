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

    if (sendMessageBtn) {
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

    if (calculateBtn) {
        calculateBtn.addEventListener('click', () => {
            const salary = parseFloat(document.getElementById('salary').value);
            const hasFamilyAllowance = document.getElementById('hasFamilyAllowance').checked;
            const startDate = new Date(document.getElementById('startDate').value);
            const endDate = new Date(document.getElementById('endDate').value);
            const workType = document.getElementById('workType').value;
            const hasCTS = document.getElementById('hasCTS').checked;
            const hasVacations = document.getElementById('hasVacations').checked;

            // Validaciones básicas
            if (isNaN(salary) || salary <= 0 || !startDate || !endDate || startDate >= endDate) {
                alert('Por favor, ingresa datos válidos para el cálculo (salario, fechas de inicio y fin).');
                return;
            }

            const MS_PER_DAY = 1000 * 60 * 60 * 24;
            const diffTime = Math.abs(endDate - startDate);
            const diffDays = Math.ceil(diffTime / MS_PER_DAY);

            // Calcular tiempo de servicio en meses y días
            let totalMonths = 0;
            let current = new Date(startDate);
            while (current < endDate) {
                current.setMonth(current.getMonth() + 1);
                if (current <= endDate) {
                    totalMonths++;
                } else {
                    current.setMonth(current.getMonth() - 1);
                    break;
                }
            }
            const remainingDays = Math.ceil(Math.abs(endDate - current) / MS_PER_DAY);

            const yearsOfService = Math.floor(totalMonths / 12);
            const monthsOfService = totalMonths % 12;
            const daysOfService = remainingDays; // Días después de los meses completos

            let serviceTimeString = '';
            if (yearsOfService > 0) serviceTimeString += `${yearsOfService} año(s) `;
            if (monthsOfService > 0) serviceTimeString += `${monthsOfService} mes(es) `;
            if (daysOfService > 0) serviceTimeString += `${daysOfService} día(s)`;
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

            // Cálculo de Vacaciones Truncas (proporcional al tiempo trabajado desde el último goce o inicio)
            if (!hasVacations) { // Si no ha gozado o le han pagado las últimas vacaciones
                const vacationMonthsWorked = totalMonths; // Meses completos
                const vacationDaysWorked = daysOfService; // Días adicionales
                
                // Las vacaciones se generan por 12 meses de trabajo (1/12 de sueldo por mes completo)
                // Se calcula por cada mes calendario completo de servicios.
                if (vacationMonthsWorked > 0 || vacationDaysWorked > 0) {
                    const dailySalary = salary / 30; // Sueldo diario
                    // Calculo de vacaciones proporcionales: Sueldo / 12 meses * meses trabajados
                    vacationsAmount = (salary / 12) * vacationMonthsWorked + (dailySalary / 12) * vacationDaysWorked; // Simplificado
                }
            }

            // Cálculo de Gratificaciones Truncas (Julio y Diciembre)
            // Se calculan por cada mes calendario completo de servicio en el periodo de gratificación (Ene-Jun o Jul-Dic)
            // Asumiendo que el cese es la fecha final del cálculo.
            // Para simplificar, calcularemos en base a los meses de servicio total.
            // La gratificación es un sueldo base + 9% de EsSalud (no incluimos EsSalud para simplificar el "neto" al trabajador)
            // Cálculo: Sueldo / 6 * meses completos trabajados en el periodo
            if (totalMonths > 0) {
                // Periodo de gratificación más reciente
                const endMonth = endDate.getMonth(); // 0-11
                let monthsInGratPeriod = 0;

                if (endMonth >= 0 && endMonth <= 5) { // Cese entre Enero y Junio (Gratificación de Julio)
                    const startOfPeriod = new Date(endDate.getFullYear(), 0, 1); // 1 de Enero del año del cese
                    const diffGratPeriod = Math.abs(endDate - startOfPeriod);
                    monthsInGratPeriod = Math.floor(diffGratPeriod / (MS_PER_DAY * 30.4375)); // Meses completos
                } else if (endMonth >= 6 && endMonth <= 11) { // Cese entre Julio y Diciembre (Gratificación de Diciembre)
                    const startOfPeriod = new Date(endDate.getFullYear(), 6, 1); // 1 de Julio del año del cese
                    const diffGratPeriod = Math.abs(endDate - startOfPeriod);
                    monthsInGratPeriod = Math.floor(diffGratPeriod / (MS_PER_DAY * 30.4375)); // Meses completos
                }
                
                gratificationAmount = (salary / 6) * monthsInGratPeriod;
            }

            // Cálculo de CTS Trunca
            // Se calcula por cada mes calendario completo de servicios, más el porcentaje de los días.
            // Es (Sueldo + Asignación Familiar) + 1/6 de gratificación / 12 * meses + (1/360 * días)
            // Para simplificar, la RC ya incluye asignación familiar. No incluimos 1/6 de gratificación para simplificar.
            if (!hasCTS) { // Si no ha recibido la última CTS (Mayo/Noviembre)
                // Se consideran los meses completos y los días adicionales.
                // Fórmula base: (Remuneración Computable Anual / 12) * meses + (Remuneración Computable Anual / 360) * días
                // O simplificado: RC * (meses / 12 + días / 360)
                ctsAmount = remunerationComputable * (totalMonths / 12 + daysOfService / 360);
            }
            
            // Cálculo de Indemnización por Despido Arbitrario (Estimado simplificado)
            // 1.5 remuneraciones por cada año completo de servicio, con un tope de 12 remuneraciones.
            // Para contratos a plazo indeterminado.
            if (workType === 'full-time' && totalMonths >= 3) { // Asumiendo mínimo 3 meses para indemnización
                indemnizationAmount = 1.5 * remunerationComputable * yearsOfService;
                // Tope: 12 remuneraciones computables
                if (indemnizationAmount > (12 * remunerationComputable)) {
                    indemnizationAmount = 12 * remunerationComputable;
                }
            } else {
                 indemnizationAmount = 0; // No aplica o es otro tipo de contrato
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
            if (href && href.startsWith('#') && href !== '#registerModal') { // Excluir #registerModal
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
