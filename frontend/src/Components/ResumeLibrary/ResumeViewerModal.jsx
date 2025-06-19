import Modal from "react-modal";

Modal.setAppElement("#root");

const ResumeViewerModal = ({ isOpen, onClose, pdfUrl }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Resume Viewer"
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        content: {
          position: "relative",
          top: "auto",
          left: "auto",
          right: "auto",
          bottom: "auto",
          height: "90vh",
          width: "85vw",
          maxWidth: "1200px",
          padding: 0,
          border: "none",
          borderRadius: "16px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          overflow: "hidden",
          background: "#ffffff",
        },
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 24px",
          borderBottom: "1px solid #e5e7eb",
          backgroundColor: "#f8fafc",
          borderRadius: "16px 16px 0 0",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "20px",
            fontWeight: "600",
            color: "#1f2937",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          }}
        >
          Resume Preview
        </h2>
        <button
          onClick={onClose}
          style={{
            background: "#f3f4f6",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            padding: "8px 16px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            color: "#374151",
            transition: "all 0.2s ease",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#e5e7eb";
            e.target.style.borderColor = "#9ca3af";
            e.target.style.transform = "translateY(-1px)";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#f3f4f6";
            e.target.style.borderColor = "#d1d5db";
            e.target.style.transform = "translateY(0)";
          }}
        >
          Close
        </button>
      </div>

      {/* PDF Container */}
      <div
        style={{
          height: "calc(100% - 81px)", // Subtract header height
          width: "100%",
          backgroundColor: "#f9fafb",
          position: "relative",
        }}
      >
        <iframe
          src={pdfUrl}
          title="Resume PDF"
          width="100%"
          height="100%"
          style={{
            border: "none",
            backgroundColor: "#ffffff",
            borderRadius: "0 0 16px 16px",
          }}
          loading="lazy"
        />
        
        {/* Loading overlay - you can enhance this further */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#f9fafb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            opacity: 0,
            transition: "opacity 0.3s ease",
          }}
          id="loading-overlay"
        >
          <div
            style={{
              fontSize: "16px",
              color: "#6b7280",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            }}
          >
            Loading PDF...
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ResumeViewerModal;