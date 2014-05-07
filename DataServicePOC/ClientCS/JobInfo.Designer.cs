namespace EmailVision.DataServicePOC.ClientCS
{
	partial class JobInfo
	{
		/// <summary> 
		/// Required designer variable.
		/// </summary>
		private System.ComponentModel.IContainer components = null;

		/// <summary> 
		/// Clean up any resources being used.
		/// </summary>
		/// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
		protected override void Dispose( bool disposing )
		{
			if ( disposing && ( components != null ) )
			{
				components.Dispose();
			}
			base.Dispose( disposing );
		}

		#region Component Designer generated code

		/// <summary> 
		/// Required method for Designer support - do not modify 
		/// the contents of this method with the code editor.
		/// </summary>
		private void InitializeComponent()
		{
			this.label1 = new System.Windows.Forms.Label();
			this.lblSubmitted = new System.Windows.Forms.Label();
			this.ProgressPreparation = new System.Windows.Forms.ProgressBar();
			this.progressRetrieval = new System.Windows.Forms.ProgressBar();
			this.BtnCancel = new System.Windows.Forms.Button();
			this.label2 = new System.Windows.Forms.Label();
			this.label3 = new System.Windows.Forms.Label();
			this.lblRowCount = new System.Windows.Forms.Label();
			this.btnExit = new System.Windows.Forms.Button();
			this.SuspendLayout();
			// 
			// label1
			// 
			this.label1.AutoSize = true;
			this.label1.Location = new System.Drawing.Point(3, 0);
			this.label1.Name = "label1";
			this.label1.Size = new System.Drawing.Size(60, 13);
			this.label1.TabIndex = 0;
			this.label1.Text = "Submitted :";
			// 
			// lblSubmitted
			// 
			this.lblSubmitted.AutoSize = true;
			this.lblSubmitted.Location = new System.Drawing.Point(69, 0);
			this.lblSubmitted.Name = "lblSubmitted";
			this.lblSubmitted.Size = new System.Drawing.Size(35, 13);
			this.lblSubmitted.TabIndex = 1;
			this.lblSubmitted.Text = "label2";
			// 
			// ProgressPreparation
			// 
			this.ProgressPreparation.BackColor = System.Drawing.Color.OliveDrab;
			this.ProgressPreparation.Location = new System.Drawing.Point(89, 16);
			this.ProgressPreparation.Name = "ProgressPreparation";
			this.ProgressPreparation.Size = new System.Drawing.Size(720, 23);
			this.ProgressPreparation.Style = System.Windows.Forms.ProgressBarStyle.Continuous;
			this.ProgressPreparation.TabIndex = 2;
			// 
			// progressRetrieval
			// 
			this.progressRetrieval.BackColor = System.Drawing.Color.Firebrick;
			this.progressRetrieval.Location = new System.Drawing.Point(89, 45);
			this.progressRetrieval.Name = "progressRetrieval";
			this.progressRetrieval.Size = new System.Drawing.Size(720, 23);
			this.progressRetrieval.Style = System.Windows.Forms.ProgressBarStyle.Continuous;
			this.progressRetrieval.TabIndex = 3;
			// 
			// BtnCancel
			// 
			this.BtnCancel.Location = new System.Drawing.Point(825, 45);
			this.BtnCancel.Name = "BtnCancel";
			this.BtnCancel.Size = new System.Drawing.Size(75, 23);
			this.BtnCancel.TabIndex = 4;
			this.BtnCancel.Text = "Cancel";
			this.BtnCancel.UseVisualStyleBackColor = true;
			this.BtnCancel.Click += new System.EventHandler(this.BtnCancel_Click);
			// 
			// label2
			// 
			this.label2.AutoSize = true;
			this.label2.Location = new System.Drawing.Point(16, 26);
			this.label2.Name = "label2";
			this.label2.Size = new System.Drawing.Size(67, 13);
			this.label2.TabIndex = 5;
			this.label2.Text = "Preparation :";
			// 
			// label3
			// 
			this.label3.AutoSize = true;
			this.label3.Location = new System.Drawing.Point(23, 50);
			this.label3.Name = "label3";
			this.label3.Size = new System.Drawing.Size(55, 13);
			this.label3.TabIndex = 6;
			this.label3.Text = "Retrieval :";
			// 
			// lblRowCount
			// 
			this.lblRowCount.AutoSize = true;
			this.lblRowCount.Location = new System.Drawing.Point(822, 26);
			this.lblRowCount.Name = "lblRowCount";
			this.lblRowCount.Size = new System.Drawing.Size(67, 13);
			this.lblRowCount.TabIndex = 7;
			this.lblRowCount.Text = "Preparation :";
			// 
			// btnExit
			// 
			this.btnExit.Location = new System.Drawing.Point(897, 3);
			this.btnExit.Name = "btnExit";
			this.btnExit.Size = new System.Drawing.Size(16, 20);
			this.btnExit.TabIndex = 8;
			this.btnExit.Text = "X";
			this.btnExit.UseVisualStyleBackColor = true;
			this.btnExit.Click += new System.EventHandler(this.btnExit_Click);
			// 
			// JobInfo
			// 
			this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
			this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
			this.Controls.Add(this.btnExit);
			this.Controls.Add(this.lblRowCount);
			this.Controls.Add(this.label3);
			this.Controls.Add(this.label2);
			this.Controls.Add(this.BtnCancel);
			this.Controls.Add(this.progressRetrieval);
			this.Controls.Add(this.ProgressPreparation);
			this.Controls.Add(this.lblSubmitted);
			this.Controls.Add(this.label1);
			this.Name = "JobInfo";
			this.Size = new System.Drawing.Size(916, 80);
			this.ResumeLayout(false);
			this.PerformLayout();

		}

		#endregion

		private System.Windows.Forms.Label label1;
		private System.Windows.Forms.Label lblSubmitted;
		private System.Windows.Forms.ProgressBar ProgressPreparation;
		private System.Windows.Forms.ProgressBar progressRetrieval;
		private System.Windows.Forms.Button BtnCancel;
		private System.Windows.Forms.Label label2;
		private System.Windows.Forms.Label label3;
		private System.Windows.Forms.Label lblRowCount;
		private System.Windows.Forms.Button btnExit;
	}
}
