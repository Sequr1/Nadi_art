interface ContactModalProps {
  onClose: () => void;
}

export default function ContactModal({ onClose }: ContactModalProps) {
  return (
    <div 
      className="fixed inset-0 z-50 bg-text-primary/20 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-milk rounded-3xl p-8 md:p-12 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-serif text-2xl md:text-3xl text-text-primary mb-4 text-center">
          Давайте поговорим
        </h3>
        <p className="text-text-secondary text-center mb-8 font-light">
          Выберите удобный способ связи
        </p>

        <div className="space-y-4">
          <a
            href="https://t.me/NadiSok73"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-400 to-blue-500 text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.121.099.154.232.17.325.015.094.034.31.019.478z"/>
            </svg>
            <span>Написать в Telegram</span>
          </a>

          <a
            href="https://vk.com/id351530308"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-700/30 hover:-translate-y-1"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.596-.19 1.364 1.259 2.177 1.815.615.42 1.083.328 1.083.328l2.175-.03s1.138-.07.598-.964c-.044-.073-.314-.661-1.618-1.869-1.366-1.263-1.183-1.058.462-3.242.999-1.328 1.398-2.139 1.273-2.485-.119-.33-.857-.243-.857-.243l-2.449.015s-.182-.025-.317.056c-.131.079-.216.262-.216.262s-.387 1.028-.903 1.902c-1.088 1.843-1.523 1.94-1.7 1.826-.414-.267-.31-1.074-.31-1.647 0-1.79.271-2.538-.528-2.732-.265-.064-.46-.107-1.139-.114-.869-.009-1.605.003-2.023.207-.278.136-.493.438-.362.455.162.022.528.099.722.363.251.341.242 1.106.242 1.106s.145 2.107-.336 2.369c-.33.18-.783-.187-1.755-1.866-.498-.859-.874-1.81-.874-1.81s-.072-.177-.201-.272c-.157-.115-.376-.151-.376-.151l-2.324.015s-.349.01-.477.161c-.114.134-.009.412-.009.412s1.82 4.259 3.879 6.401c1.889 1.963 4.032 1.833 4.032 1.833h.973z"/>
            </svg>
            <span>Написать в ВК</span>
          </a>

          <a
            href="mailto:nadisok73@gmail.com"
            className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Написать на почту</span>
          </a>

          <a
            href="https://max.com/nadisok"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-500 to-violet-600 text-white transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/30 hover:-translate-y-1"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            <span>Написать в MAX</span>
          </a>
        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full text-text-muted text-sm hover:text-text-secondary transition-colors"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}
