document.addEventListener('DOMContentLoaded', () => {
    // --- Smooth scrolling para enlaces de navegación ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            // Check if it's a modal link, if so, handle it separately
            if (targetId === '#loginModal' || targetId === '#registerModal') {
                return; // Let the modal logic handle this
            }
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- Funcionalidad del Chatbot ---
    const chatDisplay = document.getElementById('chatDisplay');
    const chatInput = document.getElementById('chatInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');

    function addMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.innerHTML = message; // Usar innerHTML para posibles enlaces o negritas
        chatDisplay.appendChild(messageDiv);
        chatDisplay.scrollTop = chatDisplay.scrollHeight; // Desplazar al final
    }

    // Lógica mejorada del chatbot (más respuestas, con enlaces y directivas)
    sendMessageBtn.addEventListener('click', () => {
        const userText = chatInput.value.trim();
        if (userText) {
            addMessage(userText, 'user');
            chatInput.value = '';

            // Simular respuesta del bot
            setTimeout(() => {
                let botResponse = "Lo siento, no tengo suficiente información para responder a eso. ¿Podrías ser más específico o preguntar sobre un tema general de derechos laborales? También puedes usar la <a href='#calculator'>calculadora</a> o ver los <a href='#models'>modelos</a>.";
                const lowerCaseUserText = userText.toLowerCase();

                if (lowerCaseUserText.includes('hola') || lowerCaseUserText.includes('qué tal') || lowerCaseUserText.includes('como estas')) {
                    botResponse = "¡Hola! Soy tu asistente de LegalWork. ¿En qué puedo ayudarte hoy con tus derechos laborales? Puedes preguntarme sobre CTS, gratificaciones, vacaciones, contratos, o usar la <a href='#calculator'>calculadora</a>.";
                } else if (lowerCaseUserText.includes('contrato')) {
                    botResponse = "Un contrato de trabajo es un acuerdo entre empleador y empleado. Puede ser a plazo fijo o indefinido. ¿Necesitas saber sobre tipos de contrato o un <a href='#models'>modelo</a>?";
                } else if (lowerCaseUserText.includes('liquidación') || lowerCaseUserText.includes('beneficios') || lowerCaseUserText.includes('me despidieron')) {
                    botResponse = "Para calcular tu liquidación y beneficios, por favor usa nuestra <a href='#calculator'>Calculadora de Liquidación</a>. Necesitarás tu sueldo, fecha de inicio y fin de labores. Si te despidieron arbitrariamente, la indemnización es un cálculo aparte y complejo que no se incluye en la estimación de la calculadora gratuita.";
                } else if (lowerCaseUserText.includes('renuncia')) {
                    botResponse = "Si deseas presentar tu renuncia, te recomendamos revisar nuestra sección de <a href='#models'>Modelos Legales</a> donde encontrarás un formato. Recuerda que debe ser voluntaria y con anticipación.";
                } else if (lowerCaseUserText.includes('cts')) {
                    botResponse = "La CTS (Compensación por Tiempo de Servicios) es un beneficio social que te protege en caso de cese. Se deposita dos veces al año (Mayo y Noviembre). Nuestra <a href='#calculator'>calculadora</a> puede estimar tu CTS trunca, pero solo si trabajas <b>full-time</b>.";
                } else if (lowerCaseUserText.includes('vacaciones')) {
                    botResponse = "Tienes derecho a vacaciones pagadas después de un año de servicios efectivos. Si no las gozas, puedes tener derecho a vacaciones truncas al finalizar tu relación laboral. La <a href='#calculator'>calculadora</a> te ayudará a estimar el monto.";
                } else if (lowerCaseUserText.includes('gratificaciones') || lowerCaseUserText.includes('grati')) {
                    botResponse = "Las gratificaciones son beneficios que se pagan en Julio y Diciembre. Equivalen a un sueldo completo más una bonificación del 9% de tu sueldo (para Essalud). Para gratificaciones truncas, se calcula proporcional al tiempo trabajado en el periodo, pero solo si trabajas <b>full-time</b>. Usa la <a href='#calculator'>calculadora</a> para estimar.";
                } else if (lowerCaseUserText.includes('premium') || lowerCaseUserText.includes('asesoría') || lowerCaseUserText.includes('abogado') || lowerCaseUserText.includes('consulta') || lowerCaseUserText.includes('empresa') || lowerCaseUserText.includes('plan')) {
                    botResponse = "¡Claro! En <a href='#premium'>LegalWork Premium</a>, ofrecemos planes para trabajadores y asesoría especializada para empresas. Obtén consultas personalizadas, documentos avanzados y más.";
                } else if (lowerCaseUserText.includes('gracias') || lowerCaseUserText.includes('muchas gracias') || lowerCaseUserText.includes('excelente')) {
                    botResponse = "De nada. Me alegra poder ayudarte. Si tienes más dudas, no dudes en preguntar.";
                } else if (lowerCaseUserText.includes('perfil') || lowerCaseUserText.includes('mi cuenta')) {
                    botResponse = "Puedes gestionar tu información y suscripción en la sección 'Perfil'. Necesitarás iniciar sesión para acceder.";
                } else if (lowerCaseUserText.includes('como funciona') || lowerCaseUserText.includes('que hacen')) {
                    botResponse = "LegalWork es una plataforma que te orienta sobre tus derechos laborales. Ofrecemos un chatbot legal, una calculadora de liquidación, modelos de documentos y asesoría legal personalizada con nuestro plan Premium.";
                } else if (lowerCaseUserText.includes('despido')) {
                    botResponse = "Si has sido despedido, es importante conocer tus derechos. Dependiendo del tipo de despido, podrías tener derecho a una indemnización. Nuestra <a href='#calculator'>calculadora</a> no la estima porque es muy compleja y depende del caso. Te sugerimos revisar la sección <a href='#premium'>Premium</a> para asesoría personalizada.";
                } else if (lowerCaseUserText.includes('asignación familiar') || lowerCaseUserText.includes('asig familiar')) {
                    botResponse = "La asignación familiar es un beneficio que se paga a los trabajadores que tienen uno o más hijos menores de 18 años, o mayores si cursan estudios superiores y no tienen límite de edad si son hijos con discapacidad. Actualmente es de S/ 102.50. Nuestra <a href='#calculator'>calculadora</a> la considera si la marcas.";
                }

                addMessage(botResponse, 'bot');
            }, 500); // Pequeño retraso para simular "pensamiento"
        }
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessageBtn.click();
        }
    });

    // --- Funcionalidad de la Calculadora ---
    const calculateBtn = document.getElementById('calculateBtn');
    const salaryInput = document.getElementById('salary');
    const hasFamilyAllowanceInput = document.getElementById('hasFamilyAllowance');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const hasCTSInput = document.getElementById('hasCTS');
    const hasVacationsInput = document.getElementById('hasVacations');
    const workTypeInput = document.getElementById('workType');
    const calculatorResults = document.getElementById('calculatorResults');

    const serviceTimeSpan = document.getElementById('serviceTime');
    const baseSalarySpan = document.getElementById('baseSalary');
    const vacationsAmountSpan = document.getElementById('vacationsAmount');
    const gratificationAmountSpan = document.getElementById('gratificationAmount');
    const ctsAmountSpan = document.getElementById('ctsAmount');
    const indemnizationAmountSpan = document.getElementById('indemnizationAmount');
    const totalLiquidationSpan = document.getElementById('totalLiquidation');

    // Función auxiliar para obtener el número de días en un mes
    function daysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }

    // Nueva función robusta para calcular meses completos para un beneficio (regla de los 15 días)
    // Retorna el número de meses completos
    function calculateMonthsForBenefit(start, end) {
        let totalMonths = 0;
        let current = new Date(start.getFullYear(), start.getMonth(), 1); // Iterar desde el primer día del mes de inicio
        let tempEndDate = new Date(end.getFullYear(), end.getMonth(), end.getDate()); // Copia de la fecha fin

        while (current <= tempEndDate) {
            let monthStartDay = (current.getFullYear() === start.getFullYear() && current.getMonth() === start.getMonth()) ? start.getDate() : 1;
            let monthEndDay = (current.getFullYear() === end.getFullYear() && current.getMonth() === end.getMonth()) ? end.getDate() : daysInMonth(current.getFullYear(), current.getMonth());

            let daysInPeriod = monthEndDay - monthStartDay + 1;

            if (daysInPeriod >= 15) {
                totalMonths++;
            }
            
            current.setMonth(current.getMonth() + 1); // Avanzar al siguiente mes
        }
        return totalMonths;
    }


    calculateBtn.addEventListener('click', () => {
        const baseSalary = parseFloat(salaryInput.value);
        const hasFamilyAllowance = hasFamilyAllowanceInput.checked;
        const startDate = new Date(startDateInput.value + 'T00:00:00');
        const endDate = new Date(endDateInput.value + 'T00:00:00');
        const workType = workTypeInput.value; // 'full-time' o 'part-time'

        const FAMILY_ALLOWANCE_AMOUNT = 102.50; // Monto de la asignación familiar en Perú

        if (isNaN(baseSalary) || baseSalary <= 0 || !startDate || !endDate || startDate >= endDate) {
            alert('Por favor, ingresa datos válidos para el sueldo y las fechas de inicio y fin de labores. La fecha de fin debe ser posterior a la fecha de inicio.');
            calculatorResults.style.display = 'none';
            return;
        }

        // Calcular Remuneración Computable Base (Sueldo Bruto + Asignación Familiar si aplica)
        let totalComputableSalary = baseSalary;
        if (hasFamilyAllowance) {
            totalComputableSalary += FAMILY_ALLOWANCE_AMOUNT;
        }
        baseSalarySpan.textContent = totalComputableSalary.toFixed(2); // Mostrar esta remuneración computable

        // --- Calcular Tiempo de Servicio real en años, meses y días ---
        let totalDaysOverall = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
        let years = Math.floor(totalDaysOverall / 365.25); // Promedio de días al año para años bisiestos
        let remainingDays = totalDaysOverall % 365.25;
        let months = Math.floor(remainingDays / (365.25 / 12));
        let days = Math.round(remainingDays % (365.25 / 12)); // Redondear los días restantes

        serviceTimeSpan.textContent = `${years} años, ${months} meses y ${days} días`;
        if (years === 0 && months === 0) {
            serviceTimeSpan.textContent = `${days} días`;
        } else if (years === 0) {
            serviceTimeSpan.textContent = `${months} meses y ${days} días`;
        }


        let totalLiquidation = 0;
        let vacationsAmount = 0;
        let gratificationAmount = 0;
        let ctsAmount = 0;
        let indemnizationAmount = 0;

        // --- Lógica de Cálculo de Beneficios Truncos (Perú) ---

        // 1. Vacaciones Truncas
        // Corresponde a ambos (Full-time y Part-time) si cumplen condiciones de jornada mínima (para part-time, 4h/día).
        // Se calcula por 1/12 de la remuneración computable por cada mes completo de servicios,
        // considerando mes completo si se laboró al menos 15 días en el mes.
        // La regla general de vacaciones es 30 días por año completo. Si no se completa el año, se paga por 30avos por cada día.
        // Para simplificar, si no ha completado el ciclo anual de 12 meses, se calcula proporcionalmente.
        let daysForVacation = totalDaysOverall; // Total de días trabajados
        if (!hasVacationsInput.checked && daysForVacation > 0) {
            // Vacaciones proporcionales: 30 días de vacación por cada año completo de servicio (365.25 días).
            // Se calcula el proporcional por día trabajado.
            vacationsAmount = (totalComputableSalary / 365.25) * daysForVacation;
        }


        // 2. Gratificaciones Truncas
        // Las gratificaciones SÓLO corresponden a trabajadores full-time con al menos 4 horas diarias de trabajo.
        // Se pagan en Julio (periodo Ene-Jun) y Diciembre (periodo Jul-Dic).
        // Se obtiene 1/6 de la remuneración computable por cada mes completo trabajado en el periodo (>=15 días).
        // Se añade una bonificación del 9% del monto de la gratificación (por concepto de EsSalud).
        if (workType === 'full-time') {
            let gratificacionMonthsAccrued = 0;
            let currentGratPeriodStart; 

            // Determinar el inicio del periodo de gratificación actual
            if (endDate.getMonth() >= 0 && endDate.getMonth() <= 5) { // Periodo Ene-Jun (0-5)
                currentGratPeriodStart = new Date(endDate.getFullYear(), 0, 1);
            } else { // Periodo Jul-Dic (6-11)
                currentGratPeriodStart = new Date(endDate.getFullYear(), 6, 1);
            }

            // La fecha de inicio efectiva para la gratificación es la mayor entre la fecha de inicio laboral y el inicio del periodo de gratificación actual.
            let effectiveGratStartDate = (startDate > currentGratPeriodStart) ? startDate : currentGratPeriodStart;

            gratificacionMonthsAccrued = calculateMonthsForBenefit(effectiveGratStartDate, endDate);
            
            // Calculo de la gratificación base
            gratificationAmount = (totalComputableSalary / 6) * gratificacionMonthsAccrued;
            // Añadir bonificación del 9% (o 6.75% si la empresa está afiliada a EPS, que no se considera en este prototipo)
            gratificationAmount *= 1.09; // Multiplicar por 1.09 para añadir el 9%

        } else {
            gratificationAmount = 0; // No corresponde a part-time
        }


        // 3. CTS Trunca
        // La CTS SÓLO corresponde a trabajadores full-time con al menos 4 horas diarias de trabajo.
        // Se deposita en Mayo (periodo Nov-Abr) y Noviembre (periodo May-Oct).
        // Se obtiene 1/12 de (remuneración computable + 1/6 de la última gratificación) por cada mes completo trabajado en el periodo (>=15 días).
        if (workType === 'full-time') {
            let ctsMonthsAccrued = 0;
            let currentCTSPeriodStart; 

            // Determinar el inicio del periodo de CTS actual
            if (endDate.getMonth() >= 4 && endDate.getMonth() <= 9) { // Periodo May-Oct (4-9)
                currentCTSPeriodStart = new Date(endDate.getFullYear(), 4, 1);
            } else { // Periodo Nov-Abr (10-3, del año anterior si el cese es Ene-Abr)
                currentCTSPeriodStart = new Date(endDate.getFullYear(), 10, 1); 
                if (endDate.getMonth() < 4) { // Si estamos en Ene-Abr, el periodo de CTS actual empezó en Nov del año anterior
                    currentCTSPeriodStart.setFullYear(endDate.getFullYear() - 1);
                }
            }

            // La fecha de inicio efectiva para la CTS es la mayor entre la fecha de inicio laboral y el inicio del periodo de CTS actual.
            let effectiveCTSStartDate = (startDate > currentCTSPeriodStart) ? startDate : currentCTSPeriodStart;

            ctsMonthsAccrued = calculateMonthsForBenefit(effectiveCTSStartDate, endDate);

            if (!hasCTSInput.checked) {
                // La remuneración computable para CTS es el sueldo bruto + 1/6 de la gratificación (base, sin bonificación del 9%)
                // Se toma la base del sueldo para 1/6 de gratificación, no el monto total con bonificación, para la CTS.
                const gratificacionParaCTS = (baseSalary / 6); 
                const computableSalaryCTS = totalComputableSalary + gratificacionParaCTS;
                ctsAmount = (computableSalaryCTS / 12) * ctsMonthsAccrued;
            }
        } else {
            ctsAmount = 0; // No corresponde a part-time
        }

        // 4. Indemnización por Despido Arbitrario
        // Siempre 0 en este prototipo. Es demasiado complejo y dependiente de factores específicos del caso (tipo de contrato, despido, etc.)
        // para ser automatizado con la información actual. Se deja una nota en la UI.
        indemnizationAmount = 0; 

        // --- Suma Total ---
        totalLiquidation = vacationsAmount + gratificationAmount + ctsAmount + indemnizationAmount;

        // Mostrar resultados
        vacationsAmountSpan.textContent = vacationsAmount.toFixed(2);
        gratificationAmountSpan.textContent = gratificationAmount.toFixed(2);
        ctsAmountSpan.textContent = ctsAmount.toFixed(2);
        indemnizationAmountSpan.textContent = indemnizationAmount.toFixed(2);
        totalLiquidationSpan.textContent = totalLiquidation.toFixed(2);

        calculatorResults.style.display = 'block'; // Mostrar resultados
    });

    // --- Funcionalidad de Modales (Iniciar Sesión/Registro) ---
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const btnLogin = document.querySelector('.btn-login');
    const btnStart = document.querySelector('.btn-start');
    const closeButtons = document.querySelectorAll('.modal .close-button');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');

    function openModal(modal) {
        modal.style.display = 'flex'; // Usar flex para centrar
    }

    function closeModal(modal) {
        modal.style.display = 'none';
    }

    btnLogin.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(loginModal);
    });

    if (btnStart) {
        btnStart.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(registerModal); // 'Comenzar' abre el modal de registro
        });
    }

    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            closeModal(e.target.closest('.modal'));
        });
    });

    // Cerrar modal al hacer clic fuera
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

    // Manejo básico de envío de formularios (solo para prototipo)
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Intento de inicio de sesión. (En un entorno real, aquí iría la validación del backend)');
        console.log('Intento de Login:', {
            email: document.getElementById('loginEmail').value,
            password: '***'
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
        console.log('Intento de Registro:', {
            name: document.getElementById('registerName').value,
            email: document.getElementById('registerEmail').value,
            password: '***'
        });
        closeModal(registerModal);
    });

    // Deshabilitar descarga de modelos premium y mostrar alerta
    document.querySelectorAll('.model-item .btn-download.disabled').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Este modelo es exclusivo para usuarios Premium. ¡Suscríbete para descargarlo!');
        });
    });
});
